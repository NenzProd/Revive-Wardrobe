import express from 'express'
import { addBlog, listBlog, removeBlog, singleBlog, editBlog } from '../controllers/blogController.js'

const blogRouter = express.Router()

blogRouter.post('/add', addBlog)
blogRouter.post('/remove', removeBlog)
blogRouter.post('/single', singleBlog)
blogRouter.post('/edit', editBlog)
blogRouter.get('/list', listBlog)

export default blogRouter
