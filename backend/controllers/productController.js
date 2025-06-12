import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"


const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, fabric, type, bestseller, stock, slug, sizes } = req.body

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
        
        const productData = {
            name,
            description,
            category,
            fabric,
            price: Number(price),
            type,
            bestseller: bestseller === "true" ? true : false,
            stock: Number(stock),
            slug,
            sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({success: true, message:"Product added"})
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
        const { id, name, description, price, category, fabric, type, bestseller, stock, slug, sizes } = req.body
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
        if (stock !== undefined) updateFields.stock = Number(stock)
        if (slug !== undefined) updateFields.slug = slug
        if (sizes !== undefined) updateFields.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes
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