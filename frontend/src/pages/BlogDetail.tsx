import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Calendar, User, ArrowLeft, Share2, Clock } from 'lucide-react'

const backendUrl = import.meta.env.VITE_BACKEND_URL

interface Blog {
  _id: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  author: string
  slug: string
  readTime: string
  category: string
}

interface BlogPostContent {
  id: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  date: string
  author: string
  readTime: string
  category: string
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(backendUrl +'/api/blog/list')
        if (!res.ok) {
          setError('Failed to load blog (server error)')
          setLoading(false)
          return
        }
        const data: { success: boolean; blogs: Blog[]; message?: string } = await res.json()
        if (data.success) {
          const found = data.blogs.find(b => b.slug === slug)
          if (found) {
            setPost({
              id: found._id,
              title: found.title,
              excerpt: found.excerpt,
              content: found.content,
              imageUrl: found.image,
              date: new Date(found.date).toLocaleDateString(),
              author: found.author,
              readTime: found.readTime,
              category: found.category
            })
          } else {
            setError('Blog post not found')
          }
        } else {
          setError(data.message || 'Failed to load blog')
        }
      } catch (err) {
        setError('Could not connect to blog API. Check your backend URL and CORS.')
      }
      setLoading(false)
    }
    fetchBlog()
  }, [slug])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading blog...</div>
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  }
  if (!post) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Blog post not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-gray-600 hover:text-revive-red transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Blog
            </Link>
          </div>
          {/* Blog Header */}
          <div className="max-w-3xl mx-auto mb-8">
            <h1 className="text-2xl md:text-4xl font-serif mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center text-gray-500 mb-6 gap-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
          {/* Featured Image */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="rounded-lg overflow-hidden h-72 md:h-96">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Blog Content */}
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            {/* Share Links */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center">
                <span className="text-gray-600 mr-4">Share this article:</span>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-revive-red transition-colors">
                    <Share2 size={18} />
                  </a>
                </div>
              </div>
            </div>
            {/* Related Posts Teaser (optional: can fetch and show more) */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BlogDetail
