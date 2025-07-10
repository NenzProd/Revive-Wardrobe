import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets';

const Orders = ({token}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      setLoading(true);
      const response = await axios.post(backendUrl + '/api/order/list', {}, {headers:{token}})
      if (response.data.success) {
        setOrders(response.data.orders)
      } else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  }, [token])

  const getStatusColor = (status) => {
    switch(status) {
      case 'Order Placed': return 'bg-blue-100 text-blue-800';
      case 'Packing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtered orders
  const filteredOrders = statusFilter === 'All' ? orders : orders.filter(order => order.status === statusFilter);

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <h2 className='text-xl md:text-2xl font-semibold mb-4 text-gray-800'>Orders</h2>
      {/* Filter dropdown */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <label htmlFor="order-status-filter" className="text-sm font-medium text-gray-700">Filter by Status:</label>
        <select
          id="order-status-filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="All">All</option>
          <option value="Order Placed">Order Placed</option>
          <option value="Packing">Packing</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <div className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden' key={index}>
              <div className="bg-gray-50 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img className='w-10 h-10' src={assets.parcel_icon} alt="" />
                  <div>
                    <p className="font-medium">Order #{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                    {order.depoterOrderId && (
                      <p className="text-xs text-gray-500">Depoter Order ID: <span className="font-mono">{order.depoterOrderId}</span></p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700 mb-2">Items</h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
                    {(order.line_items || []).map((item, idx) => {
                      const price = Number(item.price) || 0;
                      const quantity = Number(item.quantity) || 0;
                      const subtotal = price * quantity;
                      return (
                        <div key={idx} className="flex justify-between text-sm">
                          <div>
                            {item.name ? item.name : item.sku_id} x {quantity} {item.size && <span className="text-gray-500">({item.size})</span>}
                          </div>
                          <div className="text-right">
                            <span className="text-gray-500">Price:</span> {currency}{price} <span className="ml-2 text-gray-500">Subtotal:</span> {currency}{subtotal}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Total price calculation */}
                  <p className="text-sm font-medium mt-2">
                    Total Price: {currency}{(order.line_items || []).reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0)}
                  </p>
                </div>
                {/* Customer Details */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Customer</h3>
                  <p className="font-medium">{order.address?.first_name} {order.address?.last_name}</p>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    {order.address?.email && <p>Email: {order.address.email}</p>}
                    {order.address?.phone && <p>Phone: {order.address.phone}</p>}
                    <p>
                      {order.address?.address}
                      {order.address?.landmark && ", " + order.address.landmark}
                    </p>
                    <p>
                      {order.address?.city}, {order.address?.state}, {order.address?.country} {order.address?.postcode && (", " + order.address.postcode)}
                    </p>
                  </div>
                </div>
                {/* Order Status */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Order Status</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
