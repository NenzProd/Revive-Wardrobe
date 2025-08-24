import express from 'express'
import {  createPaymenntOrder, allOrders, userOrders, updateStatus,  verifyPaymennt, depoterWebhook, testEmail } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

//admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//payment features
orderRouter.post('/paymennt',authUser,createPaymenntOrder)

//user feature
orderRouter.post('/userorders', authUser, userOrders)

// verify payment
orderRouter.post('/verifyPaymennt', authUser, verifyPaymennt)

// depoter webhook
orderRouter.post('/depoterWebhook', depoterWebhook)

// test email (for debugging)
orderRouter.post('/testEmail', testEmail)

export default orderRouter