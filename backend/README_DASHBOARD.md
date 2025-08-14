# Dashboard API Documentation

## Overview
The Dashboard API provides comprehensive analytics and statistics for the admin panel, including order summaries, sales data, and product performance metrics.

## Base URL
```
http://localhost:4000/api/dashboard
```

## Authentication
All dashboard endpoints require admin authentication. Include the admin token in the request headers:
```
Authorization: Bearer <admin_token>
```

## Endpoints

### 1. Get All Dashboard Data
**GET** `/overview`

Returns all dashboard data in a single API call (recommended for initial page load).

**Response:**
```json
{
  "success": true,
  "summary": [...],
  "stats": [...],
  "weeklySales": {...},
  "bestSellers": {...}
}
```

### 2. Get Dashboard Summary
**GET** `/summary`

Returns summary cards with today's orders, yesterday's orders, this month, last month, and all-time sales.

**Response:**
```json
{
  "success": true,
  "summary": [
    {
      "label": "Today Orders",
      "value": "AED 1500.00",
      "sub": "5 orders",
      "color": "bg-primary/10 border-primary"
    }
  ]
}
```

### 3. Get Order Statistics
**GET** `/stats`

Returns order statistics including total orders, pending, processing, and delivered orders.

**Response:**
```json
{
  "success": true,
  "stats": [
    {
      "label": "Total Orders",
      "value": 1053,
      "icon": "🛒",
      "color": "bg-orange-100"
    }
  ]
}
```

### 4. Get Weekly Sales Data
**GET** `/weekly-sales`

Returns weekly sales data formatted for Chart.js line chart.

**Response:**
```json
{
  "success": true,
  "weeklySalesData": {
    "labels": ["2025-01-01", "2025-01-02"],
    "datasets": [...]
  }
}
```

### 5. Get Best Selling Products
**GET** `/best-sellers`

Returns best selling products data formatted for Chart.js pie chart.

**Response:**
```json
{
  "success": true,
  "bestSellers": [...],
  "pieData": {
    "labels": [...],
    "datasets": [...]
  }
}
```

## Data Structure

### Summary Cards
- **Today Orders**: Orders placed today with total value
- **Yesterday Orders**: Orders placed yesterday with total value  
- **This Month**: Orders placed this month with total value
- **Last Month**: Orders placed last month with total value
- **All-Time Sales**: Total sales across all time

### Order Statistics
- **Total Orders**: Count of all orders
- **Orders Pending**: Count and value of pending orders
- **Orders Processing**: Count of processing orders
- **Orders Delivered**: Count of delivered orders

### Weekly Sales Chart
- Line chart showing daily sales for the past 7 days
- Data formatted for Chart.js with proper styling

### Best Sellers Chart
- Pie chart showing top 4 best-selling products
- Includes product names, quantities, and colors

## Error Handling
All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Usage Example (Frontend)
```javascript
const fetchDashboardData = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/dashboard/overview', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': adminToken
      }
    })
    
    const data = await response.json()
    if (data.success) {
      // Use dashboard data
      setSummary(data.summary)
      setStats(data.stats)
      setWeeklySales(data.weeklySales)
      setBestSellers(data.bestSellers)
    }
  } catch (error) {
    console.error('Dashboard fetch error:', error)
  }
}
```

## Notes
- All monetary values are in AED (UAE Dirham)
- Dates are in ISO format (YYYY-MM-DD)
- Chart data is formatted for Chart.js compatibility
- The API automatically handles date calculations and data aggregation
