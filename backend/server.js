import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import addressRouter from './routes/addressRoute.js'
import blogRouter from './routes/blogRoute.js'
import cron from 'node-cron'
import { updateAllProductStocks } from './controllers/productController.js'

//App config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middleware
app.use(express.json())
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    exposedHeaders: ['Content-Type', 'Authorization', 'token'],
    credentials: true
}))

// Add preflight handler for all routes
app.options('*', cors())

//api-end points
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/address', addressRouter)
app.use('/api/blog', blogRouter)

app.get('/', (req, res)=>{
    res.send("API Working")
})

// Schedule job: every every 12 hours  
cron.schedule('0 */12 * * *', () => {
  updateAllProductStocks(
    { method: 'SCHEDULED' },
    { json: (result) => console.log('[CRON][0 */12 * * *] Stock update result:', result) }
  )
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))