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

  function handleSizesChange (e) {
    const options = Array.from(e.target.selectedOptions, o => o.value)
    setSizes(options)
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

  if (loading) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[0, 1, 2, 3].map(idx => (
            <label htmlFor={`image${idx + 1}`} key={idx}>
              <img
                className='w-25'
                src={(() => {
                  const imgFile = [image1, image2, image3, image4][idx]
                  if (imgFile) return URL.createObjectURL(imgFile)
                  if (currentImages[idx]) return currentImages[idx]
                  return assets.upload_area
                })()}
                alt=''
              />
              <input
                onChange={e => handleImageChange(idx, e.target.files[0])}
                type='file'
                id={`image${idx + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input name='name' onChange={handleChange} value={form.name} className='w-full max-w-[500px] px-3 py-2 ' type='text' placeholder='Type here' required />
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea name='description' onChange={handleChange} value={form.description} className='w-full max-w-[500px] px-3 py-2 ' type='text' placeholder='Type context here' required />
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Category</p>
          <select name='category' onChange={handleChange} value={form.category} className='w-full px-3 py-2'>
            <option value='Ethnic Elegance'>Ethnic Elegance</option>
            <option value='Graceful Abayas'>Graceful Abayas</option>
            <option value='Intimate Collection'>Intimate Collection</option>
            <option value='Stitching Services'>Stitching Services</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Type</p>
          <select name='type' onChange={handleChange} value={form.type} className='w-full px-3 py-2'>
            <option value='Stitched'>Stitched</option>
            <option value='Unstitched'>Unstitched</option>
          </select>
        </div>
        <div>
        <p className='mb-2'>Fabric</p>
        <select name='fabric' onChange={handleChange} value={form.fabric} className='w-full px-3 py-2' required>
          <option value='Lawn'>Lawn</option>
          <option value='Chiffon'>Chiffon</option>
          <option value='Silk'>Silk</option>
          <option value='Cotton'>Cotton</option>
          <option value='Organza'>Organza</option>
        </select>
      </div>
       
      </div>
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
      <div>
          <p className='mb-2'>Product Price</p>
          <input name='price' onChange={handleChange} value={form.price} className='w-full max-w-[500px] px-3 py-2' type='number' placeholder='25' required />
        </div>
        <div>
        <p className='mb-2'>Stock</p>
        <input name='stock' onChange={handleChange} value={form.stock} className='w-full max-w-[500px] px-3 py-2' type='number' min='0' placeholder='Stock quantity' required />
        </div>
      </div>
      <div className='flex gap-2 mt-2'>
        <input name='bestseller' onChange={handleChange} checked={form.bestseller} type='checkbox' id='bestseller' />
        <label className='cursor-pointer' htmlFor='bestseller'>Add to Best Seller</label>
      </div>
      <div className='w-full'>
        <p className='mb-2'>Slug</p>
        <input
          onChange={handleSlugChange}
          value={slug}
          className='w-full max-w-[500px] px-3 py-2'
          type='text'
          placeholder='slug-for-product'
          required
        />
      </div>
      <div className='w-full'>
        <p className='mb-2'>Sizes</p>
        <Select
          isMulti
          options={sizeOptions}
          value={sizeOptions.filter(opt => sizes.includes(opt.value))}
          onChange={selected => setSizes(selected.map(opt => opt.value))}
          className='w-full max-w-[500px]'
          classNamePrefix='react-select'
          placeholder='Select sizes...'
        />
      </div>
     
      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>UPDATE</button>
    </form>
  )
}

Edit.propTypes = {
  token: PropTypes.string.isRequired
}

export default Edit
