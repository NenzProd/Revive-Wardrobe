import mongoose from 'mongoose'

const blogSectionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
  },
  { strict: false, _id: false }
)

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, default: '' },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: String, required: true },
  category: { type: String, required: true },
  readTime: { type: String, required: true },
  sections: { type: [blogSectionSchema], default: [] },
})

blogSchema.index({ date: -1 })

const blogModel = mongoose.models.blog || mongoose.model('blog', blogSchema)
export default blogModel
