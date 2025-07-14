import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";
import crypto from "crypto";
import axios from 'axios'
import productModel from "../models/productModel.js";

// global variables
const currency = 'INR'
const deliveryCharge = 0


const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_SECRET_KEY
})





// placing orders using razor

const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body
        if (!amount) return res.json({ success: false, message: 'Amount required' })

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: 'rcpt_' + Date.now()
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error)
                return res.json({ success: false, message: error })
            }
            res.json({ success: true, order })
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Verify payment and create order in DB
const verifyRazorpay = async (req, res) => {
    try {
        const {
            userId, address, price, line_items, depoterOrderId, depoterId,
            razorpay_payment_id, razorpay_order_id, razorpay_signature
        } = req.body
        // Signature verification
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
        const generated_signature = hmac.digest('hex')
        if (generated_signature !== razorpay_signature) {
            return res.json({ success: false, message: 'Invalid signature' })
        }
        // Check stock for each line item
        for (const item of line_items) {
            const product = await productModel.findById(item.product_id)
            if (!product) {
                return res.json({ success: false, message: `Product not found for item ${item.product_id}` })
            }
            const variant = product.variants.find(v => v.sku === item.sku_id)
            if (!variant) {
                return res.json({ success: false, message: `Variant not found for SKU ${item.sku_id}` })
            }
            if (variant.stock < Number(item.quantity)) {
                return res.json({ success: false, message: `Insufficient stock for ${product.name} (${variant.filter_value}). Only ${variant.stock} left.` })
            }
        }
        // Decrement stock for each line item
        for (const item of line_items) {
            const product = await productModel.findById(item.product_id)
            const variant = product.variants.find(v => v.sku === item.sku_id)
            variant.stock -= Number(item.quantity)
            if (variant.stock < 0) variant.stock = 0
            await product.save()
        }
        // Create order in DB
        const orderData = {
            userId,
            address,
            price,
            line_items,
            depoterOrderId,
            depoterId,
            status: 'Order Placed',
            date: new Date()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()
        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        // Send order to Depoter
        const depoterPayload = {
            order_id: newOrder._id.toString(),
            billing: { ...address },
            shipping: { ...address },
            price: { ...price },
            line_items: line_items.map(item => ({
                sku_id: item.sku_id,
                quantity: item.quantity,
                price: item.price
            }))
        }
        let depoterOrder = null;
        try {
            const depoterRes = await axios.post(
                'https://fms.depoter.com/WMS/API/create_order/',
                depoterPayload,
                { headers: { key: '974e7b1d1ce1aadee33e' } }
            )
            depoterOrder = depoterRes.data?.order
            if (depoterOrder && depoterOrder.id && depoterOrder.depoter_order_id) {
                await orderModel.findByIdAndUpdate(newOrder._id, {
                    depoterId: depoterOrder.id,
                    depoterOrderId: depoterOrder.depoter_order_id
                })
            }
        } catch (err) {
            console.log('Depoter API error:', err?.response?.data || err.message)
            // Optionally, handle/log depoter API error
        }

        res.json({ success: true, message: 'Payment Successful, Order Placed', depoterId: depoterOrder?.id, depoterOrderId: depoterOrder?.depoter_order_id })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// all orders for admin panal

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success:true, orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// user orders data for front end

const userOrders = async (req, res) => {
    try {
        const { userId } = req.body

        const orders =  await orderModel.find({ userId })
        res.json({success: true, orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// update order status from admin panel

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success: true, message: "Order status updated successfully"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export { verifyRazorpay,  createRazorpayOrder, allOrders, userOrders, updateStatus }

