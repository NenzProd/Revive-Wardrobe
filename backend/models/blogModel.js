import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: String, required: true },
  category: { type: String, required: true },
  readTime: { type: String, required: true }
})

blogSchema.index({ date: -1 })

const blogModel = mongoose.models.blog || mongoose.model('blog', blogSchema)
export default blogModel
