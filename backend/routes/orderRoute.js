import express from 'express'
import {  createRazorpayOrder, allOrders, userOrders, updateStatus,  verifyRazorpay } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

//admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//payment features
orderRouter.post('/razorpay',authUser,createRazorpayOrder)

//user feature
orderRouter.post('/userorders', authUser, userOrders)

// verify payment
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)
export default orderRouter