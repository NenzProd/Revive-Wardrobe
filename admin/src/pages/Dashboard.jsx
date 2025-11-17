import { useState, useEffect } from 'react'
import { Line, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend)

export const backendUrls = import.meta.env.VITE_BACKEND_URL;

const Dashboard = ({ token }) => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) {
      fetchDashboardData()
    }
  }, [token])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${backendUrls}/api/dashboard/overview`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch dashboard data')
      }

      setDashboardData(data)
    } catch (err) {
      console.error('Dashboard data fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-revive-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 bg-revive-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error loading dashboard</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="p-4 md:p-8 bg-revive-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </div>
    )
  }

  const { summary, stats, weeklySales, bestSellers } = dashboardData

  // Chart options
  const weeklySalesOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
    },
  }

  const pieOptions = {
    plugins: {
      legend: { display: false },
    },
  }

  return (
    <div className="p-4 md:p-8 bg-revive-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Dashboard Overview</h2>
        <button 
          onClick={fetchDashboardData}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {summary?.map((card, i) => (
          <div key={i} className={`rounded-xl border ${card.color} p-4 flex flex-col shadow-sm`}>
            <div className="font-medium text-gray-600 mb-1">{card.label}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            {card.sub && <div className="text-xs text-gray-500">{card.sub}</div>}
          </div>
        ))}
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats?.map((stat, i) => (
          <div key={i} className={`rounded-xl p-4 flex items-center gap-4 shadow-sm ${stat.color}`}>
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">
                {stat.label} 
                {stat.sub && <span className="text-xs text-red-500 ml-1">{stat.sub}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Sales Chart */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="font-semibold text-gray-700 mb-4">Weekly Sales</div>
          <div className="flex-1 flex items-center justify-center">
            {weeklySales ? (
              <Line data={weeklySales} options={weeklySalesOptions} className="w-full h-48" />
            ) : (
              <div className="text-gray-500">No sales data available</div>
            )}
          </div>
        </div>
        
        {/* Best Selling Products Pie Chart */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="font-semibold text-gray-700 mb-4">Best Selling Products</div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {bestSellers?.pieData ? (
              <>
                <div className="w-40 h-40 mb-4">
                  <Pie data={bestSellers.pieData} options={pieOptions} />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {bestSellers.bestSellers?.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span 
                        className="inline-block w-4 h-4 rounded" 
                        style={{ backgroundColor: b.color }}
                      ></span>
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-500">No product data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard