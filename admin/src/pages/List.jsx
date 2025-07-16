import { useEffect } from 'react'
import { useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const List = ({token}) => {
    const [list, setList] = useState([])
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

    const updateStocks = async () => {
        try {
            toast.info('Updating stocks...')
            const response = await axios.post(backendUrl + '/api/product/update-stocks', {}, {headers:{token}})
            if (response.data.success) {
                toast.success(`Stocks updated! ${response.data.updatedProducts} products updated`)
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
      <div className="flex justify-between items-center mb-4">
        <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>Products List</h2>
        <button 
          onClick={updateStocks}
          className='px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors'
        >
          Update Stocks
        </button>
      </div>
      
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
            {/* Variants List */}
            <div className="mb-3">
              <p className="text-gray-500 text-sm mb-1">Variants:</p>
              <ul className="space-y-1">
                {(item.variants || []).map((variant, vIdx) => (
                  <li key={vIdx} className="text-xs bg-gray-50 rounded px-2 py-1 flex justify-between">
                    <span>SKU: <span className="font-mono">{variant.sku}</span></span>
                    <span>Stock: <span className="font-semibold">{variant.stock}</span></span>
                  </li>
                ))}
              </ul>
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

              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants (SKU / Stock)</th>
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
                  <div className="text-sm font-medium text-gray-900">{currency}{item.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ul className="space-y-1">
                    {(item.variants || []).map((variant, vIdx) => (
                      <li key={vIdx} className="text-xs bg-gray-50 rounded px-2 py-1 flex justify-between">
                        <span>SKU: <span className="font-mono">{variant.sku}</span></span>
                        <span>Stock: <span className="font-semibold">{variant.stock}</span></span>
                      </li>
                    ))}
                  </ul>
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
