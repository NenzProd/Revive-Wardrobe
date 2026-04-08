import express from 'express'
import { addBlog, listBlog, removeBlog, singleBlog, blogBySlug, editBlog, addBlogComment, listApprovedBlogComments, listBlogCommentsForAdmin, updateBlogCommentStatus } from '../controllers/blogController.js'
import { authorizeAdmin } from '../middleware/adminAuth.js'

const blogRouter = express.Router()

blogRouter.post('/add', authorizeAdmin(['super_admin', 'content_manager']), addBlog)
blogRouter.post('/remove', authorizeAdmin(['super_admin', 'content_manager']), removeBlog)
blogRouter.post('/single', singleBlog)
blogRouter.post('/edit', authorizeAdmin(['super_admin', 'content_manager']), editBlog)
blogRouter.get('/list', listBlog)
blogRouter.get('/slug/:slug', blogBySlug)
blogRouter.post('/comments/add', addBlogComment)
blogRouter.get('/comments/:slug', listApprovedBlogComments)
blogRouter.post('/comments/list', authorizeAdmin(['super_admin', 'content_manager']), listBlogCommentsForAdmin)
blogRouter.post('/comments/status', authorizeAdmin(['super_admin', 'content_manager']), updateBlogCommentStatus)

export default blogRouter
