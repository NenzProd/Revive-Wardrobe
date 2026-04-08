// updated
import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import { normalizeStock } from "../utils/pricing.js"
import {
  normalizeProductCategoryFields,
  normalizeProductDocument,
  deriveGeneralCategory,
} from "../utils/productCategory.js"


const addProduct = async (req, res) => {
  try {
    const { name, description, category, sub_category, brand, currency, lead_time, replenishment_period, hs_code, country, tax, filter_name, variants, type, bestseller, slug } = req.body

    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url
      })
    )

        let parsedVariants = []
        if (variants) {
          if (typeof variants === 'string') {
            parsedVariants = JSON.parse(variants)
          } else {
            parsedVariants = variants
          }
        }
        // Normalize incoming stock so invalid values do not break sold-out logic.
        parsedVariants = parsedVariants.map(v => ({
          ...v,
          stock: normalizeStock(v.stock)
        }))

        const normalizedCategories = normalizeProductCategoryFields({
          category,
          sub_category,
        })

        const productData = {
          name,
          description,
          ...normalizedCategories,
          brand,
          currency,
          lead_time,
          replenishment_period,
          hs_code,
          country,
          tax,
          filter_name,
          variants: parsedVariants,
          type,
          bestseller: bestseller === 'true' || bestseller === true,
          slug,
          image: imagesUrl,
          date: Date.now()
        }

        const product = new productModel(productData)
        await product.save()
        res.json({ success: true, message: 'Product added' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products: products.map(normalizeProductDocument) })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id)
    res.json({ success: true, message: "Product Removed" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body
    const product = await productModel.findById(productId)
    res.json({ success: true, product: product ? normalizeProductDocument(product) : null })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const editProduct = async (req, res) => {
  try {
    const { id, name, description, category, sub_category, brand, currency, lead_time, replenishment_period, hs_code, country, tax, filter_name, variants, type, bestseller, slug } = req.body
    if (!id) return res.json({ success: false, message: 'Product ID is required' })
    const product = await productModel.findById(id)
    if (!product) return res.json({ success: false, message: 'Product not found' })

    // Handle images
    const oldImages = product.image || []
    const files = req.files || {}
    const imageFiles = [
      files.image1 && files.image1[0],
      files.image2 && files.image2[0],
      files.image3 && files.image3[0],
      files.image4 && files.image4[0]
    ]
    const imagesUrl = await Promise.all(imageFiles.map(async (file, idx) => {
      if (file) {
        const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' })
        return result.secure_url
      } else {
        return oldImages[idx] || null
      }
    }))
    const filteredImagesUrl = imagesUrl.filter(Boolean)

    // Parse variants
    let parsedVariants = []
    if (variants) {
      if (typeof variants === 'string') {
        parsedVariants = JSON.parse(variants)
      } else {
        parsedVariants = variants
      }
    }
    // Normalize incoming stock so invalid values do not break sold-out logic.
    parsedVariants = parsedVariants.map(v => ({
      ...v,
      stock: normalizeStock(v.stock)
    }))

    // Update MongoDB
    const normalizedCategories = normalizeProductCategoryFields({
      category,
      sub_category,
    })

    const updateFields = {
      name,
      description,
      ...normalizedCategories,
      brand,
      currency,
      lead_time,
      replenishment_period,
      hs_code,
      country,
      tax,
      filter_name,
      variants: parsedVariants,
      type,
      bestseller: bestseller === 'true' || bestseller === true,
      slug,
      image: filteredImagesUrl
    }
    await productModel.findByIdAndUpdate(id, updateFields)
    res.json({ success: true, message: 'Product updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}



const updateAllProductStocks = async (req, res) => {
  try {
    const products = await productModel.find({})
    let updatedCount = 0
    for (const product of products) {
      let variantsChanged = false
      for (const variant of product.variants) {
        const normalizedStock = normalizeStock(variant.stock)
        if (variant.stock !== normalizedStock) {
          variant.stock = normalizedStock
          variantsChanged = true
        }
      }
      if (variantsChanged) {
        await product.save()
        updatedCount++
      }
    }
    res.json({ success: true, updatedProducts: updatedCount, message: "Product stock values normalized successfully." })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const bulkUpdateProducts = async (req, res) => {
  try {
    const { productIds, field, value } = req.body
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.json({ success: false, message: 'No products selected' })
    }
    if (!field) {
      return res.json({ success: false, message: 'No field specified' })
    }

    const allowedFields = ['category', 'stock', 'purchase_price', 'retail_price', 'discount', 'filter_value']
    if (!allowedFields.includes(field)) {
      return res.json({ success: false, message: `Invalid field: ${field}` })
    }

    const productLevelFields = ['category']
    const variantLevelFields = ['stock', 'purchase_price', 'retail_price', 'discount', 'filter_value']

    let updatedCount = 0

    if (productLevelFields.includes(field)) {
      const updatePayload =
        field === 'category'
          ? normalizeProductCategoryFields({
              category: value,
              sub_category: deriveGeneralCategory(value),
            })
          : { [field]: value }

      const result = await productModel.updateMany(
        { _id: { $in: productIds } },
        { $set: updatePayload }
      )
      updatedCount = result.modifiedCount
    } else if (variantLevelFields.includes(field)) {
      const products = await productModel.find({ _id: { $in: productIds } })
      for (const product of products) {
        let changed = false
        for (const variant of product.variants) {
          let newValue = value
          if (['stock', 'purchase_price', 'retail_price', 'discount'].includes(field)) {
            newValue = Number(value)
          }
          if (field === 'stock' && newValue < 0) newValue = 0
          if (field === 'discount' && newValue < 0) newValue = 0
          variant[field] = newValue
          changed = true
        }
        if (changed) {
          product.markModified('variants')
          await product.save()
          updatedCount++
        }
      }
    }

    res.json({ success: true, message: `${updatedCount} products updated`, updatedCount })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { addProduct, listProduct, removeProduct, singleProduct, editProduct, updateAllProductStocks, bulkUpdateProducts }
