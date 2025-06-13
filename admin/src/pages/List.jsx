import { useEffect } from 'react'
import { useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const List = ({token}) => {
    const [list, setList] = useState([])
    const [editStockId, setEditStockId] = useState(null)
    const [editStockValue, setEditStockValue] = useState(0)
    const navigate = useNavigate()

    const fetchList = async () =>{
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.products) {
                setList(response.data.products)   
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const removeProduct = async (id) => {
        try {
            const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers:{token}})
            if (response.data.success) {
                toast.success(response.data.message)
                await fetchList();
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchList()
    }, [])

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <h2 className='text-xl md:text-2xl font-semibold mb-4 text-gray-800'>Products List</h2>
      
      {/* Mobile view - card layout */}
      <div className="md:hidden space-y-4">
        {list.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <img className="w-16 h-16 object-cover rounded" src={item.image[0]} alt="" />
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <p className="text-gray-500">Fabric</p>
                <p>{item.fabric}</p>
              </div>
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-medium">{currency}{item.price}</p>
              </div>
              <div>
                <p className="text-gray-500">Stock</p>
                {editStockId === item._id ? (
                  <form onSubmit={async e => {
                    e.preventDefault()
                    try {
                      const response = await axios.post(backendUrl + '/api/product/edit', {
                        id: item._id,
                        stock: editStockValue
                      }, { headers: { token } })
                      if (response.data.success) {
                        toast.success(response.data.message)
                        setEditStockId(null)
                        await fetchList()
                      } else {
                        toast.error(response.data.message)
                      }
                    } catch (error) {
                      console.log(error)
                      toast.error(error.message)
                    }
                  }} className='flex gap-1'>
                    <input
                      type='number'
                      min='0'
                      value={editStockValue}
                      onChange={e => setEditStockValue(e.target.value)}
                      className='w-16 px-1 py-0.5 border rounded'
                    />
                    <button type='submit' className='text-xs px-2 py-0.5 bg-green-500 text-white rounded'>Save</button>
                  </form>
                ) : (
                  <div className='flex items-center gap-2'>
                    <span>{item.stock}</span>
                    <button onClick={() => { setEditStockId(item._id); setEditStockValue(item.stock) }} className='text-xs px-2 py-0.5 bg-blue-500 text-white rounded'>Edit</button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-2">
              <button 
                onClick={() => navigate(`/edit/${item._id}`)} 
                className='px-3 py-1.5 bg-amber-500 text-white rounded-md text-sm hover:bg-amber-600 transition-colors'
              >
                Edit
              </button>
              <button 
                onClick={() => removeProduct(item._id)} 
                className='px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view - table layout */}
      <div className='hidden md:block overflow-x-auto'>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fabric</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img className="w-12 h-12 object-cover rounded" src={item.image[0]} alt="" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.fabric}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{currency}{item.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editStockId === item._id ? (
                    <form onSubmit={async e => {
                      e.preventDefault()
                      try {
                        const response = await axios.post(backendUrl + '/api/product/edit', {
                          id: item._id,
                          stock: editStockValue
                        }, { headers: { token } })
                        if (response.data.success) {
                          toast.success(response.data.message)
                          setEditStockId(null)
                          await fetchList()
                        } else {
                          toast.error(response.data.message)
                        }
                      } catch (error) {
                        console.log(error)
                        toast.error(error.message)
                      }
                    }} className='flex gap-1'>
                      <input
                        type='number'
                        min='0'
                        value={editStockValue}
                        onChange={e => setEditStockValue(e.target.value)}
                        className='w-16 px-1 py-0.5 border rounded'
                      />
                      <button type='submit' className='text-xs px-2 py-0.5 bg-green-500 text-white rounded'>Save</button>
                      <button type='button' onClick={() => setEditStockId(null)} className='text-xs px-2 py-0.5 bg-gray-300 rounded'>Cancel</button>
                    </form>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <span className="text-sm">{item.stock}</span>
                      <button onClick={() => { setEditStockId(item._id); setEditStockValue(item.stock) }} className='text-xs px-2 py-0.5 bg-blue-500 text-white rounded'>Edit</button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/edit/${item._id}`)} 
                      className='px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition-colors'
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => removeProduct(item._id)} 
                      className='px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors'
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {list.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  )
}

List.propTypes = {
  token: PropTypes.string.isRequired
}

export default List
