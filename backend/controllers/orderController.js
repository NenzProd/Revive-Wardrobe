// placing orders using COD

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";
import crypto from "crypto";

// global variables
const currency = 'inr'
const deliveryCharge = 10


const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_SECRET_KEY
})


const placeOrder = async (req, res) => {
    try {
        const { userId, email, phone, items, amount, address } = req.body;
        
        if (!items || items.length === 0) {
            return res.json({success: false, message: "No items in cart"});
        }

        const orderData = {
            userId,
            email,
            phone,
            items: items.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            })),
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            status: "Order Placed",
            date: new Date()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success: true, message: "Order Placed"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}



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
            userId, email, phone, items, amount, address,
            razorpay_payment_id, razorpay_order_id, razorpay_signature
        } = req.body

        // Signature verification
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
        const generated_signature = hmac.digest('hex')

        if (generated_signature !== razorpay_signature) {
            return res.json({ success: false, message: 'Invalid signature' })
        }

        // Create order in DB
        const orderData = {
            userId,
            email,
            phone,
            items: items.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            })),
            address,
            amount,
            paymentMethod: 'Razorpay',
            payment: true,
            status: 'Order Placed',
            date: new Date()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: 'Payment Successful, Order Placed' })
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

export { verifyRazorpay, placeOrder, createRazorpayOrder, allOrders, userOrders, updateStatus }

