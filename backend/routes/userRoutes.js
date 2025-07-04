import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, changeUserPassword, googleLogin, verifyEmailOtp, forgotPassword, resetPassword } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/profile', authUser, getUserProfile)
userRouter.post('/update', authUser, updateUserProfile)
userRouter.post('/change-password', authUser, changeUserPassword)
userRouter.post('/google-login', googleLogin)
userRouter.post('/verify-email-otp', verifyEmailOtp)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)

export default userRouter;