import mongoose from "mongoose";

const stitchingRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true },
  addressType: { type: String, required: true, trim: true },
  fullAddress: { type: String, required: true, trim: true },
  landmark: { type: String, default: "", trim: true },
  city: { type: String, required: true, trim: true },
  pinCode: { type: String, required: true, trim: true },
  serviceType: { type: String, required: true, trim: true },
  itemCount: { type: Number, required: true, min: 1 },
  message: { type: String, default: "", trim: true },
  status: {
    type: String,
    enum: ["new", "contacted", "closed"],
    default: "new",
  },
  date: { type: Date, default: Date.now },
});

const stitchingRequestModel =
  mongoose.models.stitching_request ||
  mongoose.model("stitching_request", stitchingRequestSchema);

export default stitchingRequestModel;
