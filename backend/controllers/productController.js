import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import axios from 'axios'


const addProduct = async (req, res) => {
    try {
        const { name, description, category, sub_category, brand, currency, lead_time, replenishment_period, hs_code, country, tax, filter_name, variants, type, bestseller, slug, fabric } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item)=> item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
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

        const depoterPayload = {
          product: {
            name,
            description,
            category,
            sub_category,
            brand : "Revive Wardobe",
            currency : "AED",
            lead_time,
            replenishment_period,
            hs_code,
            country: "UAE",
            tax: "0",
            filter_name : "Size",
            variants: parsedVariants
          }
        }

        const depoterRes = await axios.post(
          'https://fms.depoter.com/WMS/API/product/',
          depoterPayload,
          { headers: { Key: '974e7b1d1ce1aadee33e' } }
        )
        console.log(depoterRes.data);
        if (depoterRes.data && depoterRes.data.status && depoterRes.data.status.response === true) {
          // Extract depoter product id and variant ids
          const depoterProductId = depoterRes.data.product && depoterRes.data.product.id
          let depoterVariants = depoterRes.data.product && Array.isArray(depoterRes.data.product.variants) ? depoterRes.data.product.variants : []
          // Map variant ids to parsedVariants
          let variantsWithDepoterIds = parsedVariants.map((variant, idx) => {
            const depoterVariant = depoterVariants[idx]
            if (depoterVariant && depoterVariant.id) {
              return { ...variant, deporterId: depoterVariant.id }
            }
            return variant
          })
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
            variants: variantsWithDepoterIds,
            type,
            bestseller: bestseller === 'true' || bestseller === true,
            slug,
            fabric,
            image: imagesUrl,
            date: Date.now(),
            deporterId: depoterProductId // store depoter product id as deporterId
          }
          const product = new productModel(productData)
          await product.save()
          res.json({ success: true, message: 'Product added', depoter: depoterRes.data.status.comment })
        } else {
          res.json({ success: false, message: depoterRes.data.status ? depoterRes.data.status.comment : 'Depoter error' })
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true, products})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"Product Removed"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true, product})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const editProduct = async (req, res) => {
    try {
        const { id, name, description, category, sub_category, brand, currency, lead_time, replenishment_period, hs_code, country, tax, filter_name, variants, type, bestseller, slug, fabric } = req.body
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

        // Update product in Depoter
        const depoterProductPayload = {
          id: product.deporterId, // use deporterId from MongoDB
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
          filter_name
        }
        const depoterProductRes = await axios.put(
          'https://fms.depoter.com/WMS/API/product/',
          depoterProductPayload,
          { headers: { Key: '974e7b1d1ce1aadee33e' } }
        )
        console.log('Depoter product update:', depoterProductRes.data)

        // Update/add variants in Depoter
        let depoterVariantResults = []
        // Build a map of existing variants by deporterId for comparison
        const existingVariantsMap = {}
        if (Array.isArray(product.variants)) {
          for (const v of product.variants) {
            if (v.deporterId) existingVariantsMap[v.deporterId] = v
          }
        }
        // Allowed fields for variant schema
        const allowedVariantFields = [
          'sku', 'retail_price', 'purchase_price', 'discount', 'weight_unit',
          'filter_value', 'min_order_quantity', 'stock', 'deporterId'
        ]
        // Helper to cast variant fields to correct types
        function castVariantFields(variant) {
          const v = { ...variant }
          if ('retail_price' in v) v.retail_price = Number(v.retail_price)
          if ('purchase_price' in v) v.purchase_price = Number(v.purchase_price)
          if ('discount' in v) v.discount = Number(v.discount)
          if ('min_order_quantity' in v) v.min_order_quantity = Number(v.min_order_quantity)
          if ('stock' in v) v.stock = Number(v.stock)
          if ('deporterId' in v) v.deporterId = Number(v.deporterId)
          if ('filter_value' in v) {
            if (Array.isArray(v.filter_value)) {
              v.filter_value = v.filter_value[0] || ''
            } else if (typeof v.filter_value !== 'string') {
              v.filter_value = String(v.filter_value)
            }
          }
          if ('weight_unit' in v && typeof v.weight_unit === 'string') {
            v.weight_unit = v.weight_unit.charAt(0).toUpperCase() + v.weight_unit.slice(1).toLowerCase()
            if (v.weight_unit !== 'Kg' && v.weight_unit !== 'Lb') v.weight_unit = 'Kg'
          }
          return v
        }
        for (const variant of parsedVariants) {
          if (variant.deporterId) {
            // Only update if changed
            const old = existingVariantsMap[variant.deporterId]
            let changed = false
            let changedFields = {}
            if (old) {
              for (const key of Object.keys(variant)) {
                if (key !== '_id' && key !== 'deporterId' && variant[key] !== old[key]) {
                  changed = true
                  changedFields[key] = variant[key]
                }
              }
            } else {
              changed = true
              changedFields = { ...variant }
            }
            if (changed) {
              // Always include id
              changedFields.id = variant.deporterId
              // Remove deporterId and _id if present
              delete changedFields.deporterId
              delete changedFields._id
              const depoterVariantPayload = { variant: changedFields }
              const result = await axios.put(
                'https://fms.depoter.com/WMS/API/variant/',
                depoterVariantPayload,
                { headers: { Key: '974e7b1d1ce1aadee33e' } }
              )
              console.log('Depoter variant update:', result.data)
              // Update MongoDB variant fields with returned data if available
              if (result.data && result.data.product && Array.isArray(result.data.product.variants)) {
                const updatedDepoterVariant = result.data.product.variants.find(v => v.id === variant.deporterId)
                if (updatedDepoterVariant) {
                  // Only keep allowed fields and cast types
                  for (const key of Object.keys(variant)) {
                    if (!allowedVariantFields.includes(key)) delete variant[key]
                  }
                  for (const key of allowedVariantFields) {
                    if (key === 'deporterId') {
                      variant.deporterId = Number(updatedDepoterVariant.id)
                    } else if (updatedDepoterVariant[key] !== undefined) {
                      variant[key] = updatedDepoterVariant[key]
                    }
                  }
                  Object.assign(variant, castVariantFields(variant))
                }
              }
              depoterVariantResults.push(result.data)
            }
          } else {
            // Add new variant
            const depoterVariantPayload = { ...variant, product_id: product.deporterId }
            const result = await axios.post(
              'https://fms.depoter.com/WMS/API/variant/',
              depoterVariantPayload,
              { headers: { Key: '974e7b1d1ce1aadee33e' } }
            )
            console.log('Depoter variant add:', result.data)
            if (result.data && result.data.variant && result.data.variant.id) {
              variant.deporterId = Number(result.data.variant.id)
            }
            // Only keep allowed fields and cast types
            for (const key of Object.keys(variant)) {
              if (!allowedVariantFields.includes(key)) delete variant[key]
            }
            Object.assign(variant, castVariantFields(variant))
            depoterVariantResults.push(result.data)
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
          fabric,
          image: filteredImagesUrl
        }
        await productModel.findByIdAndUpdate(id, updateFields)
        res.json({ success: true, message: 'Product updated', depoterProduct: depoterProductRes.data, depoterVariants: depoterVariantResults })
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
        if (!variant.sku) continue
        try {
          const depoterRes = await axios({
            method: 'get',
            url: 'https://fms.depoter.com/WMS/API/inventory/',
            headers: { Key: '974e7b1d1ce1aadee33e' },
            data: {
              sku: variant.sku,
              inventory_type: 'domestic'
            }
          })
          if (
            depoterRes.data &&
            depoterRes.data.status &&
            depoterRes.data.status.response === true &&
            depoterRes.data.inventory &&
            typeof depoterRes.data.inventory.quantity !== 'undefined'
          ) {
            const newStock = Number(depoterRes.data.inventory.quantity)
            if (variant.stock !== newStock) {
              variant.stock = newStock
              variantsChanged = true
            }
          } else {
            errors.push({ sku: variant.sku, error: depoterRes.data.status ? depoterRes.data.status.comment : 'Depoter error' })
          }
        } catch (err) {
          errors.push({ sku: variant.sku, error: err.message })
        }
      }
      if (variantsChanged) {
        await product.save()
        updatedCount++
      }
    }
    res.json({ success: true, updatedProducts: updatedCount, errors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export {addProduct, listProduct, removeProduct, singleProduct, editProduct, updateAllProductStocks}