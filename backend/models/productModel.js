import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : { type:String, required: true },
    description : { type:String, required: true },
    price: {type:Number, required:true},
    image : { type:Array, required: true },
    category : { type: String, required: true, enum: ['Ethnic Elegance', 'Graceful Abayas', 'Intimate Collection', 'Stitching Services'] },
    fabric : { type: String, required: true },
    type : { type:String, required: true },
    bestseller : { type:Boolean },
    stock: { type: Number, required: true, default: 0 },
    slug: { type: String, required: true, unique: true },
    sizes: { type: [String], required: true },
    date: { type: Date, default: Date.now }
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel