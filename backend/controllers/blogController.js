import blogModel from '../models/blogModel.js'

const addBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, image, date, author, category, readTime } = req.body
    const blog = new blogModel({ title, slug, excerpt, content, image, date, author, category, readTime })
    await blog.save()
    res.json({ success: true, message: 'Blog added' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const listBlog = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).sort({ date: -1 })
    res.json({ success: true, blogs })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const removeBlog = async (req, res) => {
  try {
    await blogModel.findByIdAndDelete(req.body.id)
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
    res.json({ success: true, message: 'Blog updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { addBlog, listBlog, removeBlog, singleBlog, editBlog }
