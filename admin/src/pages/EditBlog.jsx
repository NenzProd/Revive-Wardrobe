import axios from 'axios'
import { useState, useEffect } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Code, Eye } from 'lucide-react'

const EditBlog = ({ token }) => {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [isHtmlMode, setIsHtmlMode] = useState(false)
  const [image, setImage] = useState('')
  const [date, setDate] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [readTime, setReadTime] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await axios.post(backendUrl + '/api/blog/single', { blogId: id })
        if (res.data.success && res.data.blog) {
          const b = res.data.blog
          setTitle(b.title || '')
          setSlug(b.slug || '')
          setExcerpt(b.excerpt || '')
          setContent(b.content || '')
          setImage(b.image || '')
          setDate(b.date ? b.date.substring(0, 10) : '')
          setAuthor(b.author || '')
          setCategory(b.category || '')
          setReadTime(b.readTime || '')
        } else {
          toast.error(res.data.message || 'Blog not found')
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetchBlog()
  }, [id])

  useEffect(() => {
    if (title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      )
    } else {
      setSlug('')
    }
  }, [title])

  const onSubmitHandler = async e => {
    e.preventDefault()
    try {
      const response = await axios.post(
        backendUrl + '/api/blog/edit',
        { id, title, slug, excerpt, content, image, date, author, category, readTime },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/blog')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ]
  }

  return (
    <div className='p-4 md:p-6 bg-white rounded-lg shadow-sm'>
      <h2 className='text-xl md:text-2xl font-semibold mb-6 text-gray-800'>Edit Blog</h2>
      <form onSubmit={onSubmitHandler} className='flex flex-col w-full gap-6'>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h3 className='font-medium text-gray-700 mb-3'>Blog Information</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
              <input id='title' value={title} onChange={e => setTitle(e.target.value)} className='w-full px-3 py-2 bg-white' type='text' required />
            </div>
            <div>
              <label htmlFor='slug' className='block text-sm font-medium text-gray-700 mb-1'>Slug</label>
              <input id='slug' value={slug} onChange={e => setSlug(e.target.value)} className='w-full px-3 py-2 bg-white' type='text' required />
            </div>
          </div>
          <div className='mt-4'>
            <label htmlFor='excerpt' className='block text-sm font-medium text-gray-700 mb-1'>Excerpt</label>
            <textarea id='excerpt' value={excerpt} onChange={e => setExcerpt(e.target.value)} className='w-full px-3 py-2 bg-white min-h-[60px]' required />
          </div>
          <div className='mt-4'>
            <div className='flex justify-between items-center mb-1'>
              <label htmlFor='content' className='block text-sm font-medium text-gray-700'>Content (HTML allowed)</label>
              <button
                type='button'
                onClick={() => setIsHtmlMode(!isHtmlMode)}
                className='flex items-center text-xs text-gray-600 hover:text-gray-900 border border-gray-300 px-2 py-1 rounded transition-colors'
              >
                {isHtmlMode ? <><Eye size={14} className="mr-1" /> Visual Editor</> : <><Code size={14} className="mr-1" /> Edit HTML</>}
              </button>
            </div>
            {isHtmlMode ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 font-mono text-sm'
                style={{ minHeight: 200 }}
              />
            ) : (
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                theme='snow'
                className='bg-white rounded'
                style={{ minHeight: 200 }}
              />
            )}
          </div>
          <div className='mt-4'>
            <label htmlFor='image' className='block text-sm font-medium text-gray-700 mb-1'>Image URL</label>
            <input id='image' value={image} onChange={e => setImage(e.target.value)} className='w-full px-3 py-2 bg-white' type='text' required />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <div>
              <label htmlFor='date' className='block text-sm font-medium text-gray-700 mb-1'>Date</label>
              <input id='date' value={date} onChange={e => setDate(e.target.value)} className='w-full px-3 py-2 bg-white' type='date' />
            </div>
            <div>
              <label htmlFor='author' className='block text-sm font-medium text-gray-700 mb-1'>Author</label>
              <input id='author' value={author} onChange={e => setAuthor(e.target.value)} className='w-full px-3 py-2 bg-white' type='text' required />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <div>
              <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
              <input id='category' value={category} onChange={e => setCategory(e.target.value)} className='w-full px-3 py-2 bg-white' type='text' required />
            </div>
            <div>
              <label htmlFor='readTime' className='block text-sm font-medium text-gray-700 mb-1'>Read Time</label>
              <input id='readTime' value={readTime} onChange={e => setReadTime(e.target.value)} className='w-full px-3 py-2 bg-white' type='text' required />
            </div>
          </div>
        </div>
        <button type='submit' className='mt-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium rounded-md hover:shadow-lg transition-all w-full sm:w-auto self-start'>Save Changes</button>
      </form>
    </div>
  )
}

EditBlog.propTypes = {
  token: PropTypes.string.isRequired
}

export default EditBlog