import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  address: { type: Object, required: true },
  price: { type: Object, required: true },
  line_items: { type: Array, required: true },

  // Order status
  status: { type: String, required: true, default: "Order Placed" },
  date: { type: Date, required: true, default: Date.now },

  // Depoter integration
  depoterOrderId: { type: String, default: "" },
  depoterId: { type: String, default: "" },
  currency_code: { type: String, default: "AED" },

  // Tracking details
  shipper_name: { type: String, default: "" },
  awb: { type: String, default: "" },
  tracking_url: { type: String, default: "" },
  return_tracking_details: { type: Array, default: [] },

  // Payment info
  paymentMethod: { type: String, default: "" },
  paymentId: { type: String, default: "" },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
