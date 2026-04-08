import express from 'express'
import { addBlog, listBlog, removeBlog, singleBlog, blogBySlug, editBlog, addBlogComment, listApprovedBlogComments, listBlogCommentsForAdmin, updateBlogCommentStatus } from '../controllers/blogController.js'
import adminAuth from '../middleware/adminAuth.js'

const blogRouter = express.Router()

blogRouter.post('/add', addBlog)
blogRouter.post('/remove', removeBlog)
blogRouter.post('/single', singleBlog)
blogRouter.post('/edit', editBlog)
blogRouter.get('/list', listBlog)
blogRouter.get('/slug/:slug', blogBySlug)
blogRouter.post('/comments/add', addBlogComment)
blogRouter.get('/comments/:slug', listApprovedBlogComments)
blogRouter.post('/comments/list', adminAuth, listBlogCommentsForAdmin)
blogRouter.post('/comments/status', adminAuth, updateBlogCommentStatus)

export default blogRouter
