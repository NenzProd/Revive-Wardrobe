// updated
import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import categoryVisibilityModel from "../models/categoryVisibilityModel.js"
import priceHistoryModel from "../models/priceHistoryModel.js"
import { normalizeStock, calculatePricing } from "../utils/pricing.js"
import {
  normalizeProductCategoryFields,
  normalizeProductDocument,
  deriveGeneralCategory,
} from "../utils/productCategory.js"

const TRACKED_PRICE_FIELDS = ["retail_price", "offer_price", "discount"]
const DEFAULT_CATEGORY_VISIBILITY = [
  { category: "Graceful Abayas", slug: "graceful-abayas", enabled: true, sortOrder: 1 },
  { category: "Ethnic Elegance", slug: "ethnic-elegance", enabled: true, sortOrder: 2 },
  { category: "Jalabiya", slug: "jalabiya", enabled: true, sortOrder: 3 },
  { category: "Intimate Collection", slug: "intimate-collection", enabled: false, sortOrder: 4 },
  { category: "Stitching Services", slug: "stitching-services", enabled: false, sortOrder: 5 },
]

const toSlug = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeVariantPricing = (variant = {}, previousVariant = null) => {
  const safeVariant = { ...variant }
  delete safeVariant.purchase_price
  const retail_price = Math.max(toNumber(variant.retail_price), 0)
  const incomingDiscount = variant.discount
  const incomingOfferPrice = variant.offer_price

  const hasOfferInput =
    incomingOfferPrice !== undefined &&
    incomingOfferPrice !== null &&
    String(incomingOfferPrice).trim() !== ""

  const hasDiscountInput =
    incomingDiscount !== undefined &&
    incomingDiscount !== null &&
    String(incomingDiscount).trim() !== ""

  let pricing
  if (hasOfferInput && retail_price > 0) {
    pricing = calculatePricing({
      retailPrice: retail_price,
      offerPrice: incomingOfferPrice,
    })
  } else if (hasDiscountInput && retail_price > 0) {
    pricing = calculatePricing({
      retailPrice: retail_price,
      discount: incomingDiscount,
    })
  } else if (previousVariant && retail_price > 0) {
    pricing = calculatePricing({
      retailPrice: retail_price,
      offerPrice: previousVariant.offer_price,
      discount: previousVariant.discount,
    })
  } else {
    pricing = calculatePricing({ retailPrice: retail_price })
  }

  return {
    ...safeVariant,
    retail_price,
    offer_price: pricing.offerPrice,
    discount: pricing.discount,
  }
}

const getAdminMeta = (req) => ({
  changedBy: req?.admin?.email || "system",
  changedByRole: req?.admin?.role || "system",
})

const ensureDefaultCategoryVisibility = async () => {
  const existingCount = await categoryVisibilityModel.countDocuments()
  if (existingCount === 0) {
    await categoryVisibilityModel.insertMany(DEFAULT_CATEGORY_VISIBILITY)
  }

  const dbCategories = await productModel.distinct("category")
  for (const category of dbCategories) {
    if (!category) continue
    const exists = await categoryVisibilityModel.findOne({ category })
    if (!exists) {
      await categoryVisibilityModel.create({
        category,
        slug: toSlug(category),
        enabled: false,
        sortOrder: 100,
      })
    }
  }
}

const createPriceHistoryEntries = ({
  product,
  previousVariantMap,
  nextVariants,
  source,
  changedBy,
  changedByRole,
}) => {
  const entries = []

  for (const variant of nextVariants || []) {
    const sku = variant?.sku || ""
    const previousVariant = previousVariantMap.get(sku)
    if (!previousVariant) continue

    for (const field of TRACKED_PRICE_FIELDS) {
      const oldValue = toNumber(previousVariant[field])
      const newValue = toNumber(variant[field])
      if (oldValue === newValue) continue

      entries.push({
        productId: product._id,
        productName: product.name || "",
        sku,
        field,
        oldValue,
        newValue,
        changedBy,
        changedByRole,
        source,
        date: new Date(),
      })
    }
  }

  return entries
}


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
          ...normalizeVariantPricing(v),
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

    const previousVariantMap = new Map(
      (product.variants || []).map((variant) => [variant.sku, variant.toObject ? variant.toObject() : variant])
    )

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
    parsedVariants = parsedVariants.map(v => {
      const previousVariant = previousVariantMap.get(v?.sku || "")
      return {
        ...normalizeVariantPricing(v, previousVariant || null),
        stock: normalizeStock(v.stock),
      }
    })

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

    const adminMeta = getAdminMeta(req)
    const historyEntries = createPriceHistoryEntries({
      product,
      previousVariantMap,
      nextVariants: parsedVariants,
      source: "manual_edit",
      ...adminMeta,
    })

    if (historyEntries.length > 0) {
      await priceHistoryModel.insertMany(historyEntries)
    }

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

    const allowedFields = ['category', 'stock', 'retail_price', 'offer_price', 'discount', 'filter_value']
    if (!allowedFields.includes(field)) {
      return res.json({ success: false, message: `Invalid field: ${field}` })
    }

    const productLevelFields = ['category']
    const variantLevelFields = ['stock', 'retail_price', 'offer_price', 'discount', 'filter_value']

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
        const beforeVariantSnapshot = (product.variants || []).map((variant) =>
          variant.toObject ? variant.toObject() : { ...variant }
        )
        for (const variant of product.variants) {
          let newValue = value
          if (['stock', 'retail_price', 'offer_price', 'discount'].includes(field)) {
            newValue = Number(value)
          }
          if (field === 'stock' && newValue < 0) newValue = 0
          if (field === 'discount' && newValue < 0) newValue = 0
          variant[field] = newValue

          if (field === 'retail_price' || field === 'offer_price' || field === 'discount') {
            const pricing = calculatePricing({
              retailPrice: variant.retail_price,
              offerPrice: field === 'offer_price' ? newValue : variant.offer_price,
              discount: field === 'discount' ? newValue : variant.discount,
            })
            variant.offer_price = pricing.offerPrice
            variant.discount = pricing.discount
          }
          changed = true
        }
        if (changed) {
          product.markModified('variants')
          await product.save()

          if (TRACKED_PRICE_FIELDS.includes(field)) {
            const adminMeta = getAdminMeta(req)
            const historyEntries = createPriceHistoryEntries({
              product,
              previousVariantMap: new Map(beforeVariantSnapshot.map((variant) => [variant.sku, variant])),
              nextVariants: product.variants,
              source: "bulk_update",
              ...adminMeta,
            })

            if (historyEntries.length > 0) {
              await priceHistoryModel.insertMany(historyEntries)
            }
          }

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

const listVisibleCategories = async (req, res) => {
  try {
    await ensureDefaultCategoryVisibility()
    const categories = await categoryVisibilityModel
      .find({})
      .sort({ sortOrder: 1, category: 1 })
      .lean()
    res.json({ success: true, categories })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const updateCategoryVisibility = async (req, res) => {
  try {
    const { category, enabled } = req.body
    if (!category || typeof enabled !== "boolean") {
      return res.json({ success: false, message: "Category and enabled state are required" })
    }

    await ensureDefaultCategoryVisibility()

    const existing = await categoryVisibilityModel.findOne({ category })
    if (!existing) {
      return res.json({ success: false, message: "Category not found in visibility list" })
    }

    existing.enabled = enabled
    await existing.save()

    const categories = await categoryVisibilityModel
      .find({})
      .sort({ sortOrder: 1, category: 1 })
      .lean()

    res.json({ success: true, categories, message: "Category visibility updated" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const getPriceHistory = async (req, res) => {
  try {
    const { productId, sku, limit = 50 } = req.body

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" })
    }

    const query = { productId }
    if (sku) {
      query.sku = sku
    }

    const history = await priceHistoryModel
      .find(query)
      .sort({ date: -1 })
      .limit(Math.min(Number(limit) || 50, 200))
      .lean()

    res.json({ success: true, history })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { addProduct, listProduct, listVisibleCategories, updateCategoryVisibility, removeProduct, singleProduct, editProduct, updateAllProductStocks, bulkUpdateProducts, getPriceHistory }
