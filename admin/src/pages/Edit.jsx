import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { assets } from '../assets/assets'
import Select from 'react-select'

function Edit ({ token }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Ethnic Elegance',
    fabric: 'Lawn',
    type: 'Stitched',
    bestseller: false,
    stock: 0
  })
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)
  const [currentImages, setCurrentImages] = useState([null, null, null, null])
  const [slug, setSlug] = useState('')
  const [sizes, setSizes] = useState([])

  const sizeOptions = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' }
  ]

  useEffect(() => {
    async function fetchProduct () {
      try {
        const res = await axios.post(backendUrl + '/api/product/single', { productId: id })
        if (res.data.success && res.data.product) {
          const p = res.data.product
          setForm({
            name: p.name || '',
            description: p.description || '',
            price: p.price || '',
            category: p.category || 'Ethnic Elegance',
            fabric: p.fabric || 'Lawn',
            type: p.type || 'Stitched',
            bestseller: !!p.bestseller,
            stock: p.stock || 0
          })
          setSlug(p.slug || '')
          setSizes(p.sizes || [])
          setCurrentImages([
            p.image && p.image[0] ? p.image[0] : null,
            p.image && p.image[1] ? p.image[1] : null,
            p.image && p.image[2] ? p.image[2] : null,
            p.image && p.image[3] ? p.image[3] : null
          ])
        } else {
          toast.error('Product not found')
          navigate('/list')
        }
      } catch {
        toast.error('Error fetching product')
        navigate('/list')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  function handleChange (e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function handleImageChange (idx, file) {
    if (idx === 0) setImage1(file)
    if (idx === 1) setImage2(file)
    if (idx === 2) setImage3(file)
    if (idx === 3) setImage4(file)
  }

  function handleSlugChange (e) {
    setSlug(e.target.value)
  }

  async function handleSubmit (e) {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('id', id)
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('price', form.price)
      formData.append('category', form.category)
      formData.append('fabric', form.fabric)
      formData.append('type', form.type)
      formData.append('bestseller', form.bestseller)
      formData.append('stock', form.stock)
      formData.append('slug', slug)
      formData.append('sizes', JSON.stringify(sizes))
      if (image1) formData.append('image1', image1)
      if (image2) formData.append('image2', image2)
      if (image3) formData.append('image3', image3)
      if (image4) formData.append('image4', image4)
      const res = await axios.post(backendUrl + '/api/product/edit', formData, { headers: { token, 'Content-Type': 'multipart/form-data' } })
      if (res.data.success) {
        toast.success('Product updated')
        navigate('/list')
      } else {
        toast.error(res.data.message)
      }
    } catch {
      toast.error('Error updating product')
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div></div>

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">Edit Product</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6">
        {/* Image Upload Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-3">Product Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map(idx => (
              <label 
                htmlFor={`image${idx + 1}`} 
                key={idx}
                className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white aspect-square overflow-hidden"
              >
                <img
                  className="w-full h-full object-cover"
                  src={(() => {
                    const imgFile = [image1, image2, image3, image4][idx]
                    if (imgFile) return URL.createObjectURL(imgFile)
                    if (currentImages[idx]) return currentImages[idx]
                    return assets.upload_area
                  })()}
                  alt=""
                />
                <input
                  onChange={e => handleImageChange(idx, e.target.files[0])}
                  type="file"
                  id={`image${idx + 1}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-3">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input 
                id="name" 
                name="name" 
                onChange={handleChange} 
                value={form.name} 
                className="w-full px-3 py-2 bg-white" 
                type="text" 
                placeholder="Enter product name" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                id="slug"
                onChange={handleSlugChange}
                value={slug}
                className="w-full px-3 py-2 bg-white"
                type="text"
                placeholder="product-url-slug"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
            <textarea
              id="description"
              name="description"
              onChange={handleChange}
              value={form.description}
              className="w-full px-3 py-2 bg-white min-h-[100px]"
              placeholder="Enter product description"
              required
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-3">Product Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                name="category"
                onChange={handleChange}
                value={form.category}
                className="w-full px-3 py-2 bg-white"
              >
                <option value="Ethnic Elegance">Ethnic Elegance</option>
                <option value="Graceful Abayas">Graceful Abayas</option>
                <option value="Intimate Collection">Intimate Collection</option>
                <option value="Stitching Services">Stitching Services</option>
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                id="type"
                name="type"
                onChange={handleChange}
                value={form.type}
                className="w-full px-3 py-2 bg-white"
              >
                <option value="Stitched">Stitched</option>
                <option value="Unstitched">Unstitched</option>
              </select>
            </div>

            <div>
              <label htmlFor="fabric" className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
              <select
                id="fabric"
                name="fabric"
                onChange={handleChange}
                value={form.fabric}
                className="w-full px-3 py-2 bg-white"
                required
              >
                <option value="Lawn">Lawn</option>
                <option value="Chiffon">Chiffon</option>
                <option value="Silk">Silk</option>
                <option value="Cotton">Cotton</option>
                <option value="Organza">Organza</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                id="price"
                name="price"
                onChange={handleChange}
                value={form.price}
                className="w-full px-3 py-2 bg-white"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
                required
              />
            </div>
            
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                id="stock"
                name="stock"
                onChange={handleChange}
                value={form.stock}
                className="w-full px-3 py-2 bg-white"
                type="number"
                min="0"
                placeholder="Enter stock quantity"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="sizes" className="block text-sm font-medium text-gray-700 mb-1">Available Sizes</label>
            <Select
              id="sizes"
              isMulti
              options={sizeOptions}
              value={sizeOptions.filter(opt => sizes.includes(opt.value))}
              onChange={selected => setSizes(selected.map(opt => opt.value))}
              className="w-full bg-white"
              classNamePrefix="react-select"
              placeholder="Select sizes..."
            />
          </div>
          
          <div className="mt-4 flex items-center">
            <input
              id="bestseller"
              name="bestseller"
              onChange={handleChange}
              checked={form.bestseller}
              type="checkbox"
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-700 cursor-pointer" htmlFor="bestseller">
              Add to Best Seller
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="mt-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium rounded-md hover:shadow-lg transition-all w-full sm:w-auto self-start"
        >
          Update Product
        </button>
      </form>
    </div>
  )
}

Edit.propTypes = {
  token: PropTypes.string.isRequired
}

export default Edit
