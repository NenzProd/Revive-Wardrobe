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
            brand,
            currency,
            lead_time,
            replenishment_period,
            hs_code,
            country,
            tax,
            filter_name,
            variants: parsedVariants
          }
        }

        const depoterRes = await axios.post(
          'https://fms.depoter.com/WMS/API/product/',
          depoterPayload,
          { headers: { Key: '974e7b1d1ce1aadee33e' } }
        )
        if (depoterRes.data && depoterRes.data.status && depoterRes.data.status.response === true) {
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
            fabric,
            image: imagesUrl,
            date: Date.now()
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
        const { id, name, description, price, category, fabric, type, bestseller, slug, variants } = req.body
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

        const updateFields = {}
        if (name !== undefined) updateFields.name = name
        if (description !== undefined) updateFields.description = description
        if (price !== undefined) updateFields.price = Number(price)
        if (category !== undefined) updateFields.category = category
        if (fabric !== undefined) updateFields.fabric = fabric
        if (type !== undefined) updateFields.type = type
        if (bestseller !== undefined) updateFields.bestseller = bestseller
        if (slug !== undefined) updateFields.slug = slug
        if (variants !== undefined) {
          if (typeof variants === 'string') {
            updateFields.variants = JSON.parse(variants)
          } else {
            updateFields.variants = variants
          }
        }
        // Only update image if any file was uploaded
        if (imageFiles.some(Boolean)) updateFields.image = filteredImagesUrl

        await productModel.findByIdAndUpdate(id, updateFields)
        res.json({ success: true, message: 'Product updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {addProduct, listProduct, removeProduct, singleProduct, editProduct}