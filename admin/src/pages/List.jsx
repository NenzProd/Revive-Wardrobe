import { useEffect } from 'react'
import { useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const List = ({token}) => {
    const [list, setList] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [typeFilter, setTypeFilter] = useState('All')
    const [stockFilter, setStockFilter] = useState('All')
    const navigate = useNavigate()

    const fetchList = async () =>{
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.products) {
                setList(response.data.products)
                setFilteredList(response.data.products)
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const removeProduct = async (id, productName) => {
        // Show SweetAlert2 confirmation dialog
        const result = await Swal.fire({
            title: 'Delete Product?',
            html: `
                <p class="text-gray-700 mb-3">Are you sure you want to delete <strong>"${productName}"</strong>?</p>
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-left">
                    <p class="text-sm text-yellow-800">
                        <strong>⚠️ Important:</strong> This will only remove the product from your admin panel. 
                        The product will <strong>NOT</strong> be deleted from Depoter inventory system.
                    </p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-lg',
                confirmButton: 'px-4 py-2 rounded-md',
                cancelButton: 'px-4 py-2 rounded-md'
            }
        })
        
        if (!result.isConfirmed) return
        
        try {
            const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers:{token}})
            if (response.data.success) {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Product has been deleted from admin panel.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                })
                await fetchList();
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to delete product',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            })
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

    useEffect(() => {
        let filtered = [...list]

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.variants || []).some(v => v.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        // Category filter
        if (categoryFilter !== 'All') {
            filtered = filtered.filter(item => item.category === categoryFilter)
        }

        // Type filter
        if (typeFilter !== 'All') {
            filtered = filtered.filter(item => item.type === typeFilter)
        }

        // Stock filter
        if (stockFilter === 'In Stock') {
            filtered = filtered.filter(item => 
                (item.variants || []).some(v => v.stock > 0)
            )
        } else if (stockFilter === 'Out of Stock') {
            filtered = filtered.filter(item => 
                (item.variants || []).every(v => v.stock === 0)
            )
        } else if (stockFilter === 'Low Stock') {
            filtered = filtered.filter(item => 
                (item.variants || []).some(v => v.stock > 0 && v.stock <= 5)
            )
        }

        setFilteredList(filtered)
    }, [searchTerm, categoryFilter, typeFilter, stockFilter, list])

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>Products List</h2>
        <button 
          onClick={updateStocks}
          className='px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors'
        >
          Update Stocks
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Search by name, category, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Ethnic Elegance">Ethnic Elegance</option>
              <option value="Graceful Abayas">Graceful Abayas</option>
              <option value="Intimate Collection">Intimate Collection</option>
              <option value="Stitching Services">Stitching Services</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Stitched">Stitched</option>
              <option value="Unstitched">Unstitched</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Stock Status</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Stock</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock (≤5)</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('All')
                setTypeFilter('All')
                setStockFilter('All')
              }}
              className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing {filteredList.length} of {list.length} products
        </div>
      </div>
      
      {/* Mobile view - card layout */}
      <div className="md:hidden space-y-4">
        {filteredList.map((item, index) => (
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
                onClick={() => removeProduct(item._id, item.name)} 
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
            {filteredList.map((item, index) => (
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
                      onClick={() => removeProduct(item._id, item.name)} 
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
      
      {filteredList.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {list.length === 0 ? 'No products found' : 'No products match your filters'}
          </p>
        </div>
      )}
    </div>
  )
}

List.propTypes = {
  token: PropTypes.string.isRequired
}

export default List
