// updated
import { useEffect } from 'react'
import { useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { deriveGeneralCategory } from '../utils/productCategory'

const BULK_FIELDS = [
  { value: 'category', label: 'Category', type: 'select', options: ['Ethnic Elegance', 'Graceful Abayas', 'Intimate Collection', 'Stitching Services'] },
  { value: 'stock', label: 'Stock', type: 'number' },
  { value: 'purchase_price', label: 'Purchase Price', type: 'number' },
  { value: 'retail_price', label: 'Retail Price', type: 'number' },
  { value: 'discount', label: 'Discount (%)', type: 'number' },
  { value: 'filter_value', label: 'Size', type: 'text' },
]

const getVariantDisplayPrice = (product) => {
  const variants = Array.isArray(product?.variants) ? product.variants : []
  if (variants.length === 0) return 0

  const preferred =
    variants.find((v) => Number(v?.retail_price) > 0 && Number(v?.stock) > 0) ||
    variants.find((v) => Number(v?.retail_price) > 0) ||
    variants[0]

  const retail = Math.max(Number(preferred?.retail_price) || 0, 0)
  const discount = Math.max(Number(preferred?.discount) || 0, 0)
  return Math.max(retail - discount, 0)
}

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [stockFilter, setStockFilter] = useState('All')
  const navigate = useNavigate()

  const [selectedIds, setSelectedIds] = useState(new Set())
  const [bulkStep, setBulkStep] = useState(0)
  const [bulkField, setBulkField] = useState('')
  const [bulkValue, setBulkValue] = useState('')

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.products) {
        setList(response.data.products)
        setFilteredList(response.data.products)
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id, productName) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      html: `
                <p class="text-gray-700 mb-3">Are you sure you want to delete <strong>"${productName}"</strong>?</p>
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
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
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
      else {
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

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredList.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredList.map(p => p._id)))
    }
  }

  const startBulkUpdate = () => {
    if (selectedIds.size === 0) {
      toast.error('Select at least one product')
      return
    }
    setBulkStep(1)
    setBulkField('')
    setBulkValue('')
  }

  const cancelBulk = () => {
    setBulkStep(0)
    setBulkField('')
    setBulkValue('')
  }

  const confirmBulkUpdate = async () => {
    try {
      toast.info('Updating products...')
      const response = await axios.post(
        backendUrl + '/api/product/bulk-update',
        { productIds: [...selectedIds], field: bulkField, value: bulkValue },
        { headers: { token } }
      )
      if (response.data.success) {
        Swal.fire({
          title: 'Updated!',
          text: response.data.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        setSelectedIds(new Set())
        cancelBulk()
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getFieldConfig = () => BULK_FIELDS.find(f => f.value === bulkField)

  useEffect(() => {
    fetchList()
  }, [])

  useEffect(() => {
    let filtered = [...list]

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deriveGeneralCategory(item.category, item.sub_category).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.variants || []).some(v => v.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    if (typeFilter !== 'All') {
      filtered = filtered.filter(item => item.type === typeFilter)
    }

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

  useEffect(() => {
    const visibleIds = new Set(filteredList.map((item) => item._id))
    setSelectedIds((prev) => {
      const next = new Set([...prev].filter((id) => visibleIds.has(id)))
      return next.size === prev.size ? prev : next
    })
  }, [filteredList])

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>Products List</h2>
        <div className="flex gap-2 flex-wrap">
          {selectedIds.size > 0 && (
            <button
              onClick={startBulkUpdate}
              className='px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors'
            >
              Bulk Update ({selectedIds.size})
            </button>
          )}
        </div>
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
                setSelectedIds(new Set())
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
          {selectedIds.size > 0 && <span className="ml-2 text-purple-600 font-medium">({selectedIds.size} selected)</span>}
        </div>
      </div>

      {/* Mobile view - card layout */}
      <div className="md:hidden space-y-4">
        {filteredList.map((item, index) => (
          <div key={index} className={`bg-white rounded-lg shadow p-4 border ${selectedIds.has(item._id) ? 'border-purple-400 ring-2 ring-purple-200' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={selectedIds.has(item._id)}
                onChange={() => toggleSelect(item._id)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <img className="w-16 h-16 object-cover rounded" src={item.image[0]} alt="" />
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-xs text-gray-400">{deriveGeneralCategory(item.category, item.sub_category)}</p>
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
              <th scope="col" className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={filteredList.length > 0 && selectedIds.size === filteredList.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-purple-600 rounded"
                />
              </th>
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
              <tr key={index} className={`hover:bg-gray-50 ${selectedIds.has(item._id) ? 'bg-purple-50' : ''}`}>
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item._id)}
                    onChange={() => toggleSelect(item._id)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img className="w-12 h-12 object-cover rounded" src={item.image[0]} alt="" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.category}</div>
                  <div className="text-xs text-gray-400">{deriveGeneralCategory(item.category, item.sub_category)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{currency}{getVariantDisplayPrice(item)}</div>
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

      {/* Bulk Update Modal */}
      {bulkStep > 0 && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map(step => (
                <div key={step} className={`h-2 flex-1 rounded-full ${bulkStep >= step ? 'bg-purple-600' : 'bg-gray-200'}`} />
              ))}
            </div>

            {/* Step 1: Choose Field */}
            {bulkStep === 1 && (
              <>
                <h3 className="text-lg font-semibold mb-1">Step 1: Choose Field</h3>
                <p className="text-sm text-gray-500 mb-4">Select which field to update for {selectedIds.size} product{selectedIds.size > 1 ? 's' : ''}</p>
                <div className="space-y-2">
                  {BULK_FIELDS.map(f => (
                    <button
                      key={f.value}
                      onClick={() => { setBulkField(f.value); setBulkValue(''); setBulkStep(2) }}
                      className={`w-full text-left px-4 py-3 rounded-lg border hover:border-purple-400 hover:bg-purple-50 transition-colors ${bulkField === f.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={cancelBulk} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                </div>
              </>
            )}

            {/* Step 2: Enter Value */}
            {bulkStep === 2 && (
              <>
                <h3 className="text-lg font-semibold mb-1">Step 2: Enter Value</h3>
                <p className="text-sm text-gray-500 mb-4">Set new <strong>{getFieldConfig()?.label}</strong> value</p>
                {getFieldConfig()?.type === 'select' ? (
                  <select
                    value={bulkValue}
                    onChange={e => setBulkValue(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select...</option>
                    {getFieldConfig().options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={getFieldConfig()?.type || 'text'}
                    placeholder={`Enter new ${getFieldConfig()?.label.toLowerCase()}`}
                    value={bulkValue}
                    onChange={e => setBulkValue(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min={getFieldConfig()?.type === 'number' ? 0 : undefined}
                  />
                )}
                <div className="flex justify-between mt-6">
                  <button onClick={() => setBulkStep(1)} className="px-4 py-2 text-gray-600 hover:text-gray-800">← Back</button>
                  <button
                    onClick={() => setBulkStep(3)}
                    disabled={bulkValue === '' || bulkValue === undefined}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Confirm */}
            {bulkStep === 3 && (
              <>
                <h3 className="text-lg font-semibold mb-4">Step 3: Confirm Update</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products selected</span>
                    <span className="font-semibold">{selectedIds.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Field</span>
                    <span className="font-semibold">{getFieldConfig()?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New value</span>
                    <span className="font-semibold text-purple-600">{bulkValue}{bulkField === 'discount' ? '%' : ''}</span>
                  </div>
                </div>
                <p className="text-xs text-red-500 mb-4">⚠️ This action will update all selected products. This cannot be undone.</p>
                <div className="flex justify-between">
                  <button onClick={() => setBulkStep(2)} className="px-4 py-2 text-gray-600 hover:text-gray-800">← Back</button>
                  <button
                    onClick={confirmBulkUpdate}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Confirm Update
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

List.propTypes = {
  token: PropTypes.string.isRequired
}

export default List
