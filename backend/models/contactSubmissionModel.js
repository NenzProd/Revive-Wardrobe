import mongoose from "mongoose";

const contactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["new", "read"],
    default: "new",
  },
  date: { type: Date, default: Date.now },
});

const contactSubmissionModel =
  mongoose.models.contact_submission ||
  mongoose.model("contact_submission", contactSubmissionSchema);

export default contactSubmissionModel;
