import orderModel from '../models/orderModel.js'
import productModel from '../models/productModel.js'
import userModel from '../models/userModel.js'

// Helper function to calculate order total from line_items
const calculateOrderTotal = (order) => {
  return order.line_items.reduce((orderTotal, item) => {
    const itemPrice = parseFloat(item.price) || 0
    const itemQuantity = parseInt(item.quantity) || 1
    return orderTotal + (itemPrice * itemQuantity)
  }, 0)
}

// Get dashboard summary data
const getDashboardSummary = async (req, res) => {
  try {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

    // Today's orders
    const todayOrders = await orderModel.find({
      date: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999))
      }
    })

    // Yesterday's orders
    const yesterdayOrders = await orderModel.find({
      date: {
        $gte: new Date(yesterday.setHours(0, 0, 0, 0)),
        $lt: new Date(yesterday.setHours(23, 59, 59, 999))
      }
    })

    // This month's orders
    const thisMonthOrders = await orderModel.find({
      date: { $gte: startOfMonth }
    })

    // Last month's orders
    const lastMonthOrders = await orderModel.find({
      date: {
        $gte: startOfLastMonth,
        $lte: endOfLastMonth
      }
    })

    // All time orders
    const allTimeOrders = await orderModel.find({})

    // Calculate totals
    const calculateTotal = (orders) => {
      return orders.reduce((total, order) => {
        return total + calculateOrderTotal(order)
      }, 0)
    }

    const todayTotal = calculateTotal(todayOrders)
    const yesterdayTotal = calculateTotal(yesterdayOrders)
    const thisMonthTotal = calculateTotal(thisMonthOrders)
    const lastMonthTotal = calculateTotal(lastMonthOrders)
    const allTimeTotal = calculateTotal(allTimeOrders)

    const summary = [
      { 
        label: 'Today Orders', 
        value: `AED ${todayTotal.toFixed(2)}`, 
        sub: `${todayOrders.length} orders`, 
        color: 'bg-primary/10 border-primary' 
      },
      { 
        label: 'Yesterday Orders', 
        value: `AED ${yesterdayTotal.toFixed(2)}`, 
        sub: `${yesterdayOrders.length} orders`, 
        color: 'bg-orange-100 border-orange-400' 
      },
      { 
        label: 'This Month', 
        value: `AED ${thisMonthTotal.toFixed(2)}`, 
        sub: `${thisMonthOrders.length} orders`, 
        color: 'bg-blue-100 border-blue-400' 
      },
      { 
        label: 'Last Month', 
        value: `AED ${lastMonthTotal.toFixed(2)}`, 
        sub: `${lastMonthOrders.length} orders`, 
        color: 'bg-sky-100 border-sky-400' 
      },
      { 
        label: 'All-Time Sales', 
        value: `AED ${allTimeTotal.toFixed(2)}`, 
        sub: `${allTimeOrders.length} orders`, 
        color: 'bg-green-100 border-green-400' 
      }
    ]

    res.json({ success: true, summary })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments()
    
    const pendingOrders = await orderModel.find({ status: 'Order Placed' })
    const processingOrders = await orderModel.find({ status: 'Processing' })
    const deliveredOrders = await orderModel.find({ status: 'Delivered' })

    const pendingTotal = pendingOrders.reduce((total, order) => {
      return total + calculateOrderTotal(order)
    }, 0)

    const stats = [
      { 
        label: 'Total Orders', 
        value: totalOrders, 
        icon: '🛒', 
        color: 'bg-orange-100' 
      },
      { 
        label: 'Orders Pending', 
        value: pendingOrders.length, 
        sub: `(AED ${pendingTotal.toFixed(2)})`, 
        icon: '⏳', 
        color: 'bg-red-100' 
      },
      { 
        label: 'Orders Processing', 
        value: processingOrders.length, 
        icon: '🚚', 
        color: 'bg-blue-100' 
      },
      { 
        label: 'Orders Delivered', 
        value: deliveredOrders.length, 
        icon: '✅', 
        color: 'bg-green-100' 
      }
    ]

    res.json({ success: true, stats })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get weekly sales data
const getWeeklySales = async (req, res) => {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)

    const weeklyOrders = await orderModel.find({
      date: { $gte: startDate, $lte: endDate }
    })

    // Group orders by date
    const dailySales = {}
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dailySales[dateStr] = 0
    }

    weeklyOrders.forEach(order => {
      const orderDate = order.date.toISOString().split('T')[0]
      if (dailySales[orderDate] !== undefined) {
        dailySales[orderDate] += calculateOrderTotal(order)
      }
    })

    const labels = Object.keys(dailySales).reverse()
    const data = labels.map(date => dailySales[date])

    const weeklySalesData = {
      labels,
      datasets: [
        {
          label: 'Sales (AED)',
          data,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#3b82f6'
        }
      ]
    }

    res.json({ success: true, weeklySalesData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get best selling products
const getBestSellers = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    
    // Count product sales
    const productSales = {}
    orders.forEach(order => {
      order.line_items.forEach(item => {
        if (item.product_id) {
          if (!productSales[item.product_id]) {
            productSales[item.product_id] = 0
          }
          productSales[item.product_id] += parseInt(item.quantity) || 1
        }
      })
    })

    // Get top 4 products
    const topProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)

    // Get product details
    const bestSellers = []
    const colors = ['#d97706', '#9333ea', '#10b981', '#f59e0b']
    
    for (let i = 0; i < topProducts.length; i++) {
      const [productId, quantity] = topProducts[i]
      const product = await productModel.findById(productId)
      if (product) {
        bestSellers.push({
          label: product.name,
          color: colors[i],
          quantity: parseInt(quantity) || 0
        })
      }
    }

    // Create pie chart data
    const pieData = {
      labels: bestSellers.map(b => b.label),
      datasets: [
        {
          data: bestSellers.map(b => b.quantity),
          backgroundColor: bestSellers.map(b => b.color),
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    }

    res.json({ success: true, bestSellers, pieData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get all dashboard data in one call
const getAllDashboardData = async (req, res) => {
  try {
    // Extract data from the helper functions
    const summaryData = await getDashboardSummaryData()
    const statsData = await getOrderStatsData()
    const weeklySalesData = await getWeeklySalesData()
    const bestSellersData = await getBestSellersData()

    res.json({
      success: true,
      summary: summaryData,
      stats: statsData,
      weeklySales: weeklySalesData,
      bestSellers: bestSellersData
    })
  } catch (error) {
    console.log('Dashboard data error:', error)
    res.json({ success: false, message: error.message })
  }
}

// Helper functions to get actual data
const getDashboardSummaryData = async () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  const todayOrders = await orderModel.find({
    date: {
      $gte: new Date(today.setHours(0, 0, 0, 0)),
      $lt: new Date(today.setHours(23, 59, 59, 999))
    }
  })

  const yesterdayOrders = await orderModel.find({
    date: {
      $gte: new Date(yesterday.setHours(0, 0, 0, 0)),
      $lt: new Date(yesterday.setHours(23, 59, 59, 999))
    }
  })

  const thisMonthOrders = await orderModel.find({
    date: { $gte: startOfMonth }
  })

  const lastMonthOrders = await orderModel.find({
    date: {
      $gte: startOfLastMonth,
      $lte: endOfLastMonth
    }
  })

  const allTimeOrders = await orderModel.find({})

  const calculateTotal = (orders) => {
    return orders.reduce((total, order) => {
      return total + calculateOrderTotal(order)
    }, 0)
  }

  return [
    { 
      label: 'Today Orders', 
      value: `AED ${calculateTotal(todayOrders).toFixed(2)}`, 
      sub: `${todayOrders.length} orders`, 
      color: 'bg-primary/10 border-primary' 
    },
    { 
      label: 'Yesterday Orders', 
      value: `AED ${calculateTotal(yesterdayOrders).toFixed(2)}`, 
      sub: `${yesterdayOrders.length} orders`, 
      color: 'bg-orange-100 border-orange-400' 
    },
    { 
      label: 'This Month', 
      value: `AED ${calculateTotal(thisMonthOrders).toFixed(2)}`, 
      sub: `${thisMonthOrders.length} orders`, 
      color: 'bg-blue-100 border-blue-400' 
    },
    { 
      label: 'Last Month', 
      value: `AED ${calculateTotal(lastMonthOrders).toFixed(2)}`, 
      sub: `${lastMonthOrders.length} orders`, 
      color: 'bg-sky-100 border-sky-400' 
    },
    { 
      label: 'All-Time Sales', 
      value: `AED ${calculateTotal(allTimeOrders).toFixed(2)}`, 
      sub: `${allTimeOrders.length} orders`, 
      color: 'bg-green-100 border-green-400' 
    }
  ]
}

const getOrderStatsData = async () => {
  const totalOrders = await orderModel.countDocuments()
  
  const pendingOrders = await orderModel.find({ status: 'Order Placed' })
  const processingOrders = await orderModel.find({ status: 'Processing' })
  const deliveredOrders = await orderModel.find({ status: 'Delivered' })

  const pendingTotal = pendingOrders.reduce((total, order) => {
    return total + calculateOrderTotal(order)
  }, 0)

  return [
    { 
      label: 'Total Orders', 
      value: totalOrders, 
      icon: '🛒', 
      color: 'bg-orange-100' 
    },
    { 
      label: 'Orders Pending', 
      value: pendingOrders.length, 
      sub: `(AED ${pendingTotal.toFixed(2)})`, 
      icon: '⏳', 
      color: 'bg-red-100' 
    },
    { 
      label: 'Orders Processing', 
      value: processingOrders.length, 
      icon: '🚚', 
      color: 'bg-blue-100' 
    },
    { 
      label: 'Orders Delivered', 
      value: deliveredOrders.length, 
      icon: '✅', 
      color: 'bg-green-100' 
    }
  ]
}

const getWeeklySalesData = async () => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)

  const weeklyOrders = await orderModel.find({
    date: { $gte: startDate, $lte: endDate }
  })

  const dailySales = {}
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    dailySales[dateStr] = 0
  }

  weeklyOrders.forEach(order => {
    const orderDate = order.date.toISOString().split('T')[0]
    if (dailySales[orderDate] !== undefined) {
      dailySales[orderDate] += calculateOrderTotal(order)
    }
  })

  const labels = Object.keys(dailySales).reverse()
  const data = labels.map(date => dailySales[date])

  return {
    labels,
    datasets: [
      {
        label: 'Sales (AED)',
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6'
      }
    ]
  }
}

const getBestSellersData = async () => {
  const orders = await orderModel.find({})
  
  const productSales = {}
  orders.forEach(order => {
    order.line_items.forEach(item => {
      if (item.product_id) {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = 0
        }
        productSales[item.product_id] += parseInt(item.quantity) || 1
      }
    })
  })

  const topProducts = Object.entries(productSales)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4)

  const bestSellers = []
  const colors = ['#d97706', '#9333ea', '#10b981', '#f59e0b']
  
  for (let i = 0; i < topProducts.length; i++) {
    const [productId, quantity] = topProducts[i]
    const product = await productModel.findById(productId)
    if (product) {
      bestSellers.push({
        label: product.name,
        color: colors[i],
        quantity: parseInt(quantity) || 0
      })
    }
  }

  const pieData = {
    labels: bestSellers.map(b => b.label),
    datasets: [
      {
        data: bestSellers.map(b => b.quantity),
        backgroundColor: bestSellers.map(b => b.color),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }

  return { bestSellers, pieData }
}

export {
  getDashboardSummary,
  getOrderStats,
  getWeeklySales,
  getBestSellers,
  getAllDashboardData
}
