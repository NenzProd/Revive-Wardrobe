import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true, index: true },
  productName: { type: String, default: "" },
  sku: { type: String, default: "" },
  field: {
    type: String,
    enum: ["retail_price", "offer_price", "discount"],
    required: true,
    index: true,
  },
  oldValue: { type: Number, default: 0 },
  newValue: { type: Number, default: 0 },
  changedBy: { type: String, default: "system" },
  changedByRole: { type: String, default: "system" },
  source: { type: String, enum: ["manual_edit", "bulk_update"], default: "manual_edit" },
  date: { type: Date, default: Date.now, index: true },
});

priceHistorySchema.index({ productId: 1, date: -1 });

const priceHistoryModel =
  mongoose.models.priceHistory || mongoose.model("priceHistory", priceHistorySchema);

export default priceHistoryModel;
