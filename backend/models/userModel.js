import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    deliveryAddress: { type: Object, default: {} },
    savedAddresses: { type: Array, default: [] },
    primaryAddress: { type: Object, default: {} },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel