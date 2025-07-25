import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    address: { type: Object, required: true },
    price: { type: Object, required: true },
    line_items: { type: Array, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    date: { type: Date, required: true, default: Date.now },
    depoterOrderId: { type: String, default: '' },
    depoterId: { type: String, default: '' }
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel;