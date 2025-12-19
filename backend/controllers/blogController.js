import blogModel from '../models/blogModel.js'

let cachedBlogList = null
let cachedBlogListAt = 0
const BLOG_LIST_CACHE_TTL_MS = 60 * 1000

const invalidateBlogListCache = () => {
  cachedBlogList = null
  cachedBlogListAt = 0
}

const addBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, image, date, author, category, readTime } = req.body
    const blog = new blogModel({ title, slug, excerpt, content, image, date, author, category, readTime })
    await blog.save()
    invalidateBlogListCache()
    res.json({ success: true, message: 'Blog added' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const listBlog = async (req, res) => {
  try {
    const now = Date.now()
    if (cachedBlogList && now - cachedBlogListAt < BLOG_LIST_CACHE_TTL_MS) {
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
      return res.json({ success: true, blogs: cachedBlogList })
    }

    // List view does not need full `content` (often large) – keep payload light for faster LCP.
    const blogs = await blogModel
      .find({})
      .select('title slug excerpt image date author category readTime')
      .sort({ date: -1 })
      .lean()

    cachedBlogList = blogs
    cachedBlogListAt = now

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    res.json({ success: true, blogs })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const removeBlog = async (req, res) => {
  try {
    await blogModel.findByIdAndDelete(req.body.id)
    invalidateBlogListCache()
    res.json({ success: true, message: 'Blog Removed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const singleBlog = async (req, res) => {
  try {
    const { blogId } = req.body
    const blog = await blogModel.findById(blogId)
    res.json({ success: true, blog })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const blogBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    if (!slug) return res.json({ success: false, message: 'Slug is required' })

    const blog = await blogModel.findOne({ slug }).lean()
    if (!blog) return res.json({ success: false, message: 'Blog not found' })

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    res.json({ success: true, blog })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const editBlog = async (req, res) => {
  try {
    const { id, title, slug, excerpt, content, image, date, author, category, readTime } = req.body
    if (!id) return res.json({ success: false, message: 'Blog ID is required' })
    const blog = await blogModel.findById(id)
    if (!blog) return res.json({ success: false, message: 'Blog not found' })
    const updateFields = {}
    if (title !== undefined) updateFields.title = title
    if (slug !== undefined) updateFields.slug = slug
    if (excerpt !== undefined) updateFields.excerpt = excerpt
    if (content !== undefined) updateFields.content = content
    if (image !== undefined) updateFields.image = image
    if (date !== undefined) updateFields.date = date
    if (author !== undefined) updateFields.author = author
    if (category !== undefined) updateFields.category = category
    if (readTime !== undefined) updateFields.readTime = readTime
    await blogModel.findByIdAndUpdate(id, updateFields)
    invalidateBlogListCache()
    res.json({ success: true, message: 'Blog updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { addBlog, listBlog, removeBlog, singleBlog, blogBySlug, editBlog }
