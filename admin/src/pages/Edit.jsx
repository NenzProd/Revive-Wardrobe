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
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)
  const [currentImages, setCurrentImages] = useState([null, null, null, null])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Ethnic Elegance')
  const [type, setType] = useState('Stitched')
  const [bestseller, setBestseller] = useState(false)
  const [slug, setSlug] = useState('')
  const [fabric, setFabric] = useState('Lawn')
  const [variants, setVariants] = useState([
    {
      sku: '',
      purchase_price: '',
      retail_price: '',
      discount: 0,
      weight_unit: 'Kg',
      filter_value: '',
      min_order_quantity: 1,
      stock: 0
    }
  ])

  const sizeOptions = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' }
  ]

  function generateSku (slug, filterValue) {
    if (!slug || !filterValue) return ''
    return `${slug.toUpperCase()}-${filterValue}`
  }

  function getUsedFilterValues (excludeIdx) {
    // Collect all filter_value from variants except the current one
    return variants
      .filter((_, i) => i !== excludeIdx)
      .map(v => v.filter_value)
      .filter(Boolean)
  }

  useEffect(() => {
    async function fetchProduct () {
      try {
        const res = await axios.post(backendUrl + '/api/product/single', { productId: id })
        if (res.data.success && res.data.product) {
          const p = res.data.product
          setName(p.name || '')
          setDescription(p.description || '')
          setCategory(p.category || 'Ethnic Elegance')
          setType(p.type || 'Stitched')
          setBestseller(!!p.bestseller)
          setSlug(p.slug || '')
          setFabric(p.fabric || 'Lawn')
          setVariants(Array.isArray(p.variants) && p.variants.length > 0 ? p.variants : [{
            sku: '',
            purchase_price: '',
            retail_price: '',
            discount: 0,
            weight_unit: 'Kg',
            filter_value: '',
            min_order_quantity: 1,
            stock: 0
          }])
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

  useEffect(() => {
    // Auto-generate slug from name
    if (name) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      )
    } else {
      setSlug('')
    }
    // No longer auto-generate SKUs here, will do per variant below
  }, [name])

  function handleImageChange (idx, file) {
    if (idx === 0) setImage1(file)
    if (idx === 1) setImage2(file)
    if (idx === 2) setImage3(file)
    if (idx === 3) setImage4(file)
  }

  function handleVariantChange (idx, field, value) {
    const v = [...variants]
    v[idx][field] = value
    setVariants(v)
  }

  function handleVariantSizeChange (idx, selected) {
    const v = [...variants]
    v[idx].filter_value = selected ? selected.value : ''
    setVariants(v)
  }

  function handleRemoveVariant (idx) {
    if (variants.length > 1) setVariants(variants.filter((_, i) => i !== idx))
  }

  function handleAddVariant () {
    setVariants([...variants, {
      sku: '',
      purchase_price: '',
      retail_price: '',
      discount: 0,
      weight_unit: 'Kg',
      filter_value: '',
      min_order_quantity: 1,
      stock: 0
    }])
  }

  async function handleSubmit (e) {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('id', id)
      formData.append('name', name)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('type', type)
      formData.append('bestseller', bestseller)
      formData.append('slug', slug)
      formData.append('fabric', fabric)
      // Ensure each variant has a unique SKU before submitting
      const variantsWithSku = variants.map(variant => ({
        ...variant,
        sku: generateSku(slug, variant.filter_value)
      }))
      formData.append('variants', JSON.stringify(variantsWithSku))
      if (image1) formData.append('image1', image1)
      if (image2) formData.append('image2', image2)
      if (image3) formData.append('image3', image3)
      if (image4) formData.append('image4', image4)
      const res = await axios.put(backendUrl + '/api/product/edit', formData, { headers: { token, 'Content-Type': 'multipart/form-data' } })
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
                onChange={e => setName(e.target.value)} 
                value={name} 
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
                onChange={e => setSlug(e.target.value)}
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
              onChange={e => setDescription(e.target.value)}
              value={description}
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
                onChange={e => setCategory(e.target.value)}
                value={category}
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
                onChange={e => setType(e.target.value)}
                value={type}
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
                onChange={e => setFabric(e.target.value)}
                value={fabric}
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
          {/* Variants Section */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Variants</h4>
            {variants.map((variant, idx) => (
              <div key={idx} className="border rounded-lg p-4 mb-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input type="text" className="w-full px-3 py-2 bg-gray-50" value={generateSku(slug, variant.filter_value)} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                    <input type="number" className="w-full px-3 py-2 bg-gray-50" value={variant.purchase_price} onChange={e => handleVariantChange(idx, 'purchase_price', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retail Price</label>
                    <input type="number" className="w-full px-3 py-2 bg-gray-50" value={variant.retail_price} onChange={e => handleVariantChange(idx, 'retail_price', e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input type="number" className="w-full px-3 py-2 bg-gray-50" value={variant.discount} onChange={e => handleVariantChange(idx, 'discount', e.target.value)} min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight Unit</label>
                    <select className="w-full px-3 py-2 bg-gray-50" value={variant.weight_unit} onChange={e => handleVariantChange(idx, 'weight_unit', e.target.value)}>
                      <option value="Kg">Kg</option>
                      <option value="Lb">Lb</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Quantity</label>
                    <input type="number" className="w-full px-3 py-2 bg-gray-50" value={variant.min_order_quantity} onChange={e => handleVariantChange(idx, 'min_order_quantity', e.target.value)} min="1" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size(eg. XS)</label>
                    <Select
                      isMulti={false}
                      options={sizeOptions.map(opt => ({
                        ...opt,
                        isDisabled: getUsedFilterValues(idx).includes(opt.value)
                      }))}
                      value={sizeOptions.find(opt => opt.value === variant.filter_value) || null}
                      onChange={selected => handleVariantSizeChange(idx, selected)}
                      className="w-full bg-white"
                      classNamePrefix="react-select"
                      placeholder="Select filter value..."
                    />
                  </div>
                  <div className="flex items-end">
                    {/* Only allow removing new variants (no deporterId/id) and if more than 1 variant */}
                    {(!('deporterId' in variant || 'id' in variant) && variants.length > 1) && (
                      <button type="button" className="text-red-600 font-medium ml-2" onClick={() => handleRemoveVariant(idx)}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="mt-2 px-4 py-2 bg-gray-200 rounded" onClick={handleAddVariant}>
              + Add Variant
            </button>
          </div>
          <div className="mt-4 flex items-center">
            <input
              id="bestseller"
              onChange={e => setBestseller(e.target.checked)}
              checked={bestseller}
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
