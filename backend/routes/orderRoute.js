import express from 'express'
import {  createPaymenntOrder, allOrders, userOrders, updateStatus,  verifyPaymennt, depoterWebhook, testEmail, deleteOrder, getOrderWhatsAppLink } from '../controllers/orderController.js'
import { authorizeAdmin } from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

//admin features
orderRouter.post('/list', authorizeAdmin(['super_admin', 'operations_manager']), allOrders)
orderRouter.post('/status', authorizeAdmin(['super_admin', 'operations_manager']), updateStatus)
orderRouter.post('/delete', authorizeAdmin(['super_admin']), deleteOrder)
orderRouter.post('/whatsapp-link', authorizeAdmin(['super_admin', 'operations_manager']), getOrderWhatsAppLink)

//payment features
orderRouter.post('/paymennt',authUser,createPaymenntOrder)

//user feature
orderRouter.post('/userorders', authUser, userOrders)

// verify payment
orderRouter.post('/verifyPaymennt', authUser, verifyPaymennt)

// depoter webhook
orderRouter.post('/depoterWebhook', depoterWebhook)

// test email (for debugging)
orderRouter.post('/testEmail', authorizeAdmin(['super_admin']), testEmail)

export default orderRouter
