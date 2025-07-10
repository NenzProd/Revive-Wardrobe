import React from 'react'
import { Line, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend)

const mockSummary = [
  { label: 'Today Orders', value: 'AED 3000', sub: '', color: 'bg-primary/10 border-primary' },
  { label: 'Yesterday Orders', value: 'AED 4000', sub: '', color: 'bg-orange-100 border-orange-400' },
  { label: 'This Month', value: 'AED 15727.17', sub: '', color: 'bg-blue-100 border-blue-400' },
  { label: 'Last Month', value: 'AED 11335.45', sub: '', color: 'bg-sky-100 border-sky-400' },
  { label: 'All-Time Sales', value: 'AED 856856.98', sub: '', color: 'bg-green-100 border-green-400' },
]
const mockStats = [
  { label: 'Total Order', value: 1053, icon: '🛒', color: 'bg-orange-100' },
  { label: 'Orders Pending', value: 331, sub: '(247475.90)', icon: '⏳', color: 'bg-red-100' },
  { label: 'Orders Processing', value: 148, icon: '🚚', color: 'bg-blue-100' },
  { label: 'Orders Delivered', value: 461, icon: '✅', color: 'bg-green-100' },
]

const bestSellers = [
  { label: 'Royal Anarkali Suit', color: '#d97706' },
  { label: 'Embroidered Saree', color: '#9333ea' },
  { label: 'Chikankari Kurti', color: '#10b981' },
  { label: 'Banarasi Lehenga', color: '#f59e0b' },
]


// Mock chart data
const weeklySalesData = {
  labels: ['2025-07-01', '2025-07-02', '2025-07-03', '2025-07-04', '2025-07-05', '2025-07-06', '2025-07-07'],
  datasets: [
    {
      label: 'Orders',
      data: [1, 2, 1.5, 2.2, 1.8, 2.5, 2],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#3b82f6',
    },
  ],
}
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

const pieData = {
  labels: bestSellers.map(b => b.label),
  datasets: [
    {
      data: [30, 25, 20, 25],
      backgroundColor: bestSellers.map(b => b.color),
      borderWidth: 2,
      borderColor: '#fff',
    },
  ],
}
const pieOptions = {
  plugins: {
    legend: { display: false },
  },
}

const Dashboard = () => {
  return (
    <div className="p-4 md:p-8 bg-revive-white min-h-screen">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">Dashboard Overview</h2>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {mockSummary.map((card, i) => (
          <div key={i} className={`rounded-xl border ${card.color} p-4 flex flex-col shadow-sm`}>
            <div className="font-medium text-gray-600 mb-1">{card.label}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
            {card.sub && <div className="text-xs text-gray-500">{card.sub}</div>}
          </div>
        ))}
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {mockStats.map((stat, i) => (
          <div key={i} className={`rounded-xl p-4 flex items-center gap-4 shadow-sm ${stat.color}`}>
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label} {stat.sub && <span className="text-xs text-red-500 ml-1">{stat.sub}</span>}</div>
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
            <Line data={weeklySalesData} options={weeklySalesOptions} className="w-full h-48" />
          </div>
        </div>
        {/* Best Selling Products Pie Chart */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="font-semibold text-gray-700 mb-4">Best Selling Products</div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-40 h-40 mb-4">
              <Pie data={pieData} options={pieOptions} />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {bestSellers.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: b.color }}></span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard