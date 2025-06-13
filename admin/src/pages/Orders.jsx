import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets';

const Orders = ({token}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status:event.target.value}, {headers:{token}})
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
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

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <h2 className='text-xl md:text-2xl font-semibold mb-4 text-gray-800'>Orders</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden' key={index}>
              <div className="bg-gray-50 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img className='w-10 h-10' src={assets.parcel_icon} alt="" />
                  <div>
                    <p className="font-medium">Order #{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-medium">{currency} {order.amount}</p>
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
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <p>
                          {item.name} x {item.quantity} {item.size && <span className="text-gray-500">({item.size})</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium mt-2">Total Items: {order.items.length}</p>
                </div>
                
                {/* Customer Details */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Customer</h3>
                  <p className="font-medium">{order.address.name}</p>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <p>{order.address.building}, {order.address.street}, {order.address.area}</p>
                    <p>{order.address.city}, {order.address.country}</p>
                    {order.email && <p>Email: {order.email}</p>}
                    {order.phone && <p>Phone: {order.phone}</p>}
                  </div>
                </div>
                
                {/* Payment & Status */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Payment & Status</h3>
                  <div className="space-y-2">
                    <p className="text-sm">Method: <span className="font-medium">{order.paymentMethod}</span></p>
                    <p className="text-sm">Status: <span className={`font-medium ${order.payment ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.payment ? 'Paid' : 'Pending'}
                    </span></p>
                    
                    <div className="mt-4">
                      <label htmlFor={`status-${order._id}`} className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                      <select 
                        id={`status-${order._id}`}
                        onChange={(event) => statusHandler(event, order._id)} 
                        value={order.status} 
                        className='w-full p-2 bg-white border border-gray-300 rounded-md text-sm'
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
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
