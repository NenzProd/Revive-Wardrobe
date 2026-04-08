import blogModel from '../models/blogModel.js'
import blogCommentModel from '../models/blogCommentModel.js'

let cachedBlogList = null
let cachedBlogListAt = 0
const BLOG_LIST_CACHE_TTL_MS = 60 * 1000

const invalidateBlogListCache = () => {
  cachedBlogList = null
  cachedBlogListAt = 0
}

const parseSections = (sectionsInput) => {
  if (!sectionsInput) return []

  const parsed =
    typeof sectionsInput === 'string'
      ? JSON.parse(sectionsInput)
      : sectionsInput

  if (!Array.isArray(parsed)) return []

  return parsed.filter((section) => section && typeof section === 'object' && section.type)
}

const addBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, image, date, author, category, readTime, sections } = req.body
    const blog = new blogModel({
      title,
      slug,
      excerpt,
      content,
      image,
      date,
      author,
      category,
      readTime,
      sections: parseSections(sections),
    })
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
    const { id, title, slug, excerpt, content, image, date, author, category, readTime, sections } = req.body
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
    if (sections !== undefined) updateFields.sections = parseSections(sections)
    await blogModel.findByIdAndUpdate(id, updateFields)
    invalidateBlogListCache()
    res.json({ success: true, message: 'Blog updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const addBlogComment = async (req, res) => {
  try {
    const { slug, name, email, comment } = req.body

    if (!slug || !name || !email || !comment) {
      return res.json({ success: false, message: 'All fields are required' })
    }

    const blog = await blogModel.findOne({ slug }).select('_id').lean()
    if (!blog) {
      return res.json({ success: false, message: 'Blog not found' })
    }

    const createdComment = await blogCommentModel.create({
      blogId: blog._id,
      name,
      email,
      comment,
      status: 'pending',
    })

    res.json({
      success: true,
      message: 'Comment submitted successfully. It will appear after moderation.',
      commentId: createdComment._id,
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const listApprovedBlogComments = async (req, res) => {
  try {
    const { slug } = req.params
    const blog = await blogModel.findOne({ slug }).select('_id').lean()
    if (!blog) {
      return res.json({ success: false, message: 'Blog not found' })
    }

    const comments = await blogCommentModel
      .find({ blogId: blog._id, status: 'approved' })
      .select('name comment date')
      .sort({ date: -1 })
      .lean()

    res.json({ success: true, comments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const listBlogCommentsForAdmin = async (req, res) => {
  try {
    const { status } = req.body
    const query = status && status !== 'all' ? { status } : {}

    const comments = await blogCommentModel
      .find(query)
      .sort({ date: -1 })
      .populate({ path: 'blogId', select: 'title slug' })
      .lean()

    res.json({ success: true, comments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const updateBlogCommentStatus = async (req, res) => {
  try {
    const { commentId, status } = req.body
    const allowedStatuses = ['approved', 'rejected']

    if (!commentId || !allowedStatuses.includes(status)) {
      return res.json({ success: false, message: 'Invalid comment update payload' })
    }

    const updated = await blogCommentModel.findByIdAndUpdate(
      commentId,
      { status },
      { new: true }
    )

    if (!updated) {
      return res.json({ success: false, message: 'Comment not found' })
    }

    res.json({ success: true, message: `Comment ${status}` })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { addBlog, listBlog, removeBlog, singleBlog, blogBySlug, editBlog, addBlogComment, listApprovedBlogComments, listBlogCommentsForAdmin, updateBlogCommentStatus }
