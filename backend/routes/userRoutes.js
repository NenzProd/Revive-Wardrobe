import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, changeUserPassword } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/profile', authUser, getUserProfile)
userRouter.post('/update', authUser, updateUserProfile)
userRouter.post('/change-password', authUser, changeUserPassword)

export default userRouter;