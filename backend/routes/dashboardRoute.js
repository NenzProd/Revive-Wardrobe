import express from 'express'
import { 
  getDashboardSummary, 
  getOrderStats, 
  getWeeklySales, 
  getBestSellers, 
  getAllDashboardData 
} from '../controllers/dashboardController.js'
import { authorizeAdmin } from '../middleware/adminAuth.js'

const dashboardRouter = express.Router()

// All dashboard routes require admin authentication
dashboardRouter.use(authorizeAdmin(['super_admin', 'operations_manager', 'inventory_manager', 'content_manager']))

// Get all dashboard data in one call (recommended for initial load)
dashboardRouter.get('/overview', getAllDashboardData)

// Individual dashboard data endpoints
dashboardRouter.get('/summary', getDashboardSummary)
dashboardRouter.get('/stats', getOrderStats)
dashboardRouter.get('/weekly-sales', getWeeklySales)
dashboardRouter.get('/best-sellers', getBestSellers)

export default dashboardRouter
