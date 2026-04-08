import mongoose from "mongoose";

const categoryVisibilitySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, trim: true },
  enabled: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
});

const categoryVisibilityModel =
  mongoose.models.categoryVisibility ||
  mongoose.model("categoryVisibility", categoryVisibilitySchema);

export default categoryVisibilityModel;
