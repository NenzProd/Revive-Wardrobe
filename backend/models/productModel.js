import mongoose from "mongoose";

// Variant Schema
const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },                 // Required by Depoter
  retail_price: { type: Number },
  purchase_price: { type: Number },
  discount: { type: Number, default: 0 },
  weight_unit: { type: String, enum: ['Kg', 'Lb'], default: 'Kg' },
  filter_value: { type: String },                      // E.g. "XS"
  min_order_quantity: { type: Number, default: 1 },
  stock: { type: Number, default: 0 },
  deporterId: { type: Number } // Depoter variant id
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: [String], required: true },
  category: { type: String, required: true },
  sub_category: { type: String },
  Fabric: { type: String },
  type: { type: String },
  bestseller: { type: Boolean, default: false },
  brand: { type: String },
  slug: { type: String, required: true },
  currency: { type: String, default: 'AED' },
  lead_time: { type: String },
  replenishment_period: { type: String },
  hs_code: { type: String },
  country: { type: String, default: 'UAE' },
  tax: { type: String },
  filter_name: { type: String, default: 'Size' },                       // E.g. ["Size"]
  variants: [variantSchema],                             // Array of variant objects
  date: { type: Date, default: Date.now },
  deporterId: { type: Number } // Depoter product id
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;
