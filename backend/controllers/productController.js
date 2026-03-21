import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"


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

        const productData = {
          name,
          description,
          category,
          sub_category,
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
    res.json({ success: true, products })
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
    res.json({ success: true, product })
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

    // Update MongoDB
    const updateFields = {
      name,
      description,
      category,
      sub_category,
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
    // Fetch all products
    const products = await productModel.find({})
    let updatedCount = 0
    let errors = []
    for (const product of products) {
      let variantsChanged = false
      for (const variant of product.variants) {
        // Set stock to 1 for every variant
        if (variant.stock !== 1) {
          variant.stock = 1
          variantsChanged = true
        }
      }
      if (variantsChanged) {
        await product.save()
        updatedCount++
      }
    }
    res.json({ success: true, updatedProducts: updatedCount, message: "All stocks updated to 1 piece." })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { addProduct, listProduct, removeProduct, singleProduct, editProduct, updateAllProductStocks }