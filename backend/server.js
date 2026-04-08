// updated
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
import dashboardRouter from './routes/dashboardRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import cron from 'node-cron'
import { updateAllProductStocks } from './controllers/productController.js'
import { backfillMissingProductSubCategories } from './utils/productCategory.js'

//App config
const app = express()
const port = process.env.PORT || 4000

//middleware
app.use(express.json())
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL, "http://localhost:3000", "http://localhost:5174", "http://localhost:5175"],
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
app.use('/api/dashboard', dashboardRouter)
app.use('/api/review', reviewRouter)

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

const startServer = async () => {
  try {
    await connectDB()
    await connectCloudinary()

    const { updatedCount } = await backfillMissingProductSubCategories()
    if (updatedCount > 0) {
      console.log(`[STARTUP] Backfilled general category for ${updatedCount} products`)
    }

    app.listen(port, ()=> console.log('Server started on PORT : '+ port))
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
