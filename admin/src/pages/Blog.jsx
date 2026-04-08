import { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AddBlog from './AddBlog'

const Blog = ({ token }) => {
  const [blogs, setBlogs] = useState([])
  const [comments, setComments] = useState([])
  const [commentStatusFilter, setCommentStatusFilter] = useState('pending')
  const [showAdd, setShowAdd] = useState(false)
  const navigate = useNavigate()

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/blog/list')
      if (response.data.success) {
        setBlogs(response.data.blogs)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeBlog = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/blog/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchBlogs()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchComments = async (status = commentStatusFilter) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/blog/comments/list',
        { status },
        { headers: { token } }
      )
      if (response.data.success) {
        setComments(response.data.comments || [])
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const updateCommentStatus = async (commentId, status) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/blog/comments/status',
        { commentId, status },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        fetchComments(commentStatusFilter)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchBlogs()
    fetchComments(commentStatusFilter)
  }, [])

  useEffect(() => {
    fetchComments(commentStatusFilter)
  }, [commentStatusFilter])

  // Helper to strip HTML tags
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Blogs</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium rounded-md hover:shadow-lg transition-all"
        >
          {showAdd ? 'Close' : 'Add Blog'}
        </button>
      </div>
      {showAdd && <AddBlog token={token} onSuccess={fetchBlogs} />}
      {/* Mobile view: cards */}
      <div className="md:hidden space-y-4 mt-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <div className="mb-2">
              <div 
                className="text-lg font-semibold text-gray-900 overflow-hidden whitespace-nowrap"
                style={{ maskImage: 'linear-gradient(to right, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)' }}
              >
                {stripHtml(blog.title)}
              </div>
              <div className="text-sm text-gray-500">{blog.author} • {blog.category}</div>
              <div className="text-xs text-gray-400">{new Date(blog.date).toLocaleDateString()}</div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => navigate(`/editblog/${blog._id}`)}
                className="px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => removeBlog(blog._id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No blogs found</p>
          </div>
        )}
      </div>
      {/* Desktop view: table */}
      <div className="hidden md:block overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap max-w-xs relative">
                  <div 
                    className="text-sm font-medium text-gray-900 overflow-hidden"
                    style={{ maskImage: 'linear-gradient(to right, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)' }}
                  >
                    {stripHtml(blog.title)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{blog.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{blog.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(blog.date).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/editblog/${blog._id}`)}
                      className="px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeBlog(blog._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {blogs.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No blogs found</p>
          </div>
        )}
      </div>

      <div className="mt-10 border-t pt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">Comments Moderation</h3>
          <select
            value={commentStatusFilter}
            onChange={(e) => setCommentStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
        </div>

        <div className="space-y-3">
          {comments.length === 0 && (
            <p className="text-sm text-gray-500">No comments found for this filter.</p>
          )}
          {comments.map((comment) => (
            <div key={comment._id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-800">{comment.name}</p>
                  <p className="text-xs text-gray-500">{comment.email}</p>
                  <p className="text-xs text-gray-500">
                    Blog: {comment.blogId?.title || 'Unknown'} | {new Date(comment.date).toLocaleString()}
                  </p>
                </div>
                <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 uppercase">
                  {comment.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-700">{comment.comment}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => updateCommentStatus(comment._id, 'approved')}
                  className="px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateCommentStatus(comment._id, 'rejected')}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog
