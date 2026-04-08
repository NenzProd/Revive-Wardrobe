import mongoose from 'mongoose'

const blogCommentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  comment: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  date: { type: Date, default: Date.now },
})

blogCommentSchema.index({ blogId: 1, status: 1, date: -1 })

const blogCommentModel =
  mongoose.models.blogComment || mongoose.model('blogComment', blogCommentSchema)

export default blogCommentModel
