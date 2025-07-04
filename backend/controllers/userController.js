import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js';
import { OAuth2Client } from 'google-auth-library'
import transporter from '../config/nodemailer.js'
import { WELCOME_EMAIL_TEMPLATE, EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const createToken=(id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html
  })
}

// route for user login
const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Check if input is email or phone
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const query = isEmail ? { email: identifier } : { phone: identifier };

        const user = await userModel.findOne(query);

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            if (!user.isAccountVerified) {
                // Generate and send new OTP
                const otp = generateOtp()
                user.verifyOtp = otp
                user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000
                await user.save()
                const verifyHtml = EMAIL_VERIFY_TEMPLATE.replace('{{name}}', user.name).replace('{{verifyLink}}', '')
                await sendMail({
                  to: user.email,
                  subject: 'Verify your email - Revive Wardrobe',
                  html: verifyHtml.replace('Verify Email', `Your OTP: <b>${otp}</b>`)
                })
                return res.json({ success: false, message: 'Please verify your email before logging in. A new OTP has been sent to your email.' })
            }
            const token = createToken(user._id);
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};


// route for user regsiter

const registerUser = async (req, res) => {
    try {
    const { name, phone, email, password } = req.body
    const exists = await userModel.findOne({ $or: [{ email }, { phone }] })
    if (exists) return res.json({ success: false, message: 'User Already Exists' })
    if (!validator.isEmail(email)) return res.json({ success: false, message: 'please enter a valid email' })
    if (!validator.isMobilePhone(phone)) return res.json({ success: false, message: 'please enter a valid phone number' })
    if (password.length < 8) return res.json({ success: false, message: 'please enter a 8 character password' })
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
    const otp = generateOtp()
    const otpExpire = Date.now() + 10 * 60 * 1000 // 10 min
        const newUser = new userModel({
            name,
            phone,
            email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpireAt: otpExpire,
      isAccountVerified: false
    })
    await newUser.save()
    // Send verification email
    const verifyHtml = EMAIL_VERIFY_TEMPLATE.replace('{{name}}', name).replace('{{verifyLink}}', '')
    await sendMail({
      to: email,
      subject: 'Verify your email - Revive Wardrobe',
      html: verifyHtml.replace('Verify Email', `Your OTP: <b>${otp}</b>`) // Show OTP in email
    })
    res.json({ success: true, message: 'Registration successful. Please verify your email.' })
    } catch (error) {
        console.log(error)
    res.json({ success: false, message: error.message })
    }
}

// route for admin login
const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success:true, token})
        }
        else{
            res.json({success:false, message:"invalid credits"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId
    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, email, phone } = req.body
    const user = await userModel.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    // Check for unique email/phone (exclude current user)
    const emailExists = await userModel.findOne({ email, _id: { $ne: userId } })
    if (emailExists) return res.json({ success: false, message: 'Email already exists' })
    const phoneExists = await userModel.findOne({ phone, _id: { $ne: userId } })
    if (phoneExists) return res.json({ success: false, message: 'Phone number already exists' })

    user.name = name
    user.email = email
    user.phone = phone
    await user.save()
    res.json({ success: true, user: { name: user.name, email: user.email, phone: user.phone } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Change user password
const changeUserPassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body
    const user = await userModel.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) return res.json({ success: false, message: 'Current password is incorrect' })

    if (newPassword.length < 8) return res.json({ success: false, message: 'Password must be at least 8 characters' })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()
    res.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const googleLogin = async (req, res) => {
  try {
    const { credential, signupAllowed, phone } = req.body
    if (!credential) return res.json({ success: false, message: 'No credential provided' })

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    if (!payload) return res.json({ success: false, message: 'Invalid Google token' })

    const { email, name, sub } = payload
    if (!email) return res.json({ success: false, message: 'No email in Google account' })

    let user = await userModel.findOne({ email })
    if (!user) {
      if (!signupAllowed) {
        return res.json({ success: false, message: 'No account found. Please sign up first.' })
      }
      if (!phone) {
        return res.json({ success: false, message: 'Phone number required for signup.' })
      }
      user = new userModel({
        name: name || 'Google User',
        email,
        phone,
        password: await bcrypt.hash(sub, 10),
        isAccountVerified: true
      })
      await user.save()
    }

    const token = createToken(user._id)
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Email OTP verification endpoint
const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await userModel.findOne({ email })
    if (!user) return res.json({ success: false, message: 'User not found' })
    if (user.isAccountVerified) return res.json({ success: true, message: 'Already verified' })
    if (user.verifyOtp !== otp) return res.json({ success: false, message: 'Invalid OTP' })
    if (user.verifyOtpExpireAt < Date.now()) return res.json({ success: false, message: 'OTP expired' })
    user.isAccountVerified = true
    user.verifyOtp = ''
    user.verifyOtpExpireAt = 0
    await user.save()
    // Send welcome email
    const welcomeHtml = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', user.name).replace('{{loginLink}}', 'https://www.revivewardrobe.com/login')
    await sendMail({
      to: user.email,
      subject: 'Welcome to Revive Wardrobe',
      html: welcomeHtml
    })
    res.json({ success: true, message: 'Email verified successfully' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Forgot password (send OTP)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    if (!user) return res.json({ success: false, message: 'User not found' })
    const otp = generateOtp()
    user.resetOtp = otp
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000
    await user.save()
    const resetHtml = PASSWORD_RESET_TEMPLATE.replace('{{name}}', user.name).replace('{{resetLink}}', '')
    await sendMail({
      to: user.email,
      subject: 'Reset your password - Revive Wardrobe',
      html: resetHtml.replace('Reset Password', `Your OTP: <b>${otp}</b>`) // Show OTP in email
    })
    res.json({ success: true, message: 'OTP sent to your email' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Reset password (verify OTP and set new password)
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    const user = await userModel.findOne({ email })
    if (!user) return res.json({ success: false, message: 'User not found' })
    if (user.resetOtp !== otp) return res.json({ success: false, message: 'Invalid OTP' })
    if (user.resetOtpExpireAt < Date.now()) return res.json({ success: false, message: 'OTP expired' })
    if (newPassword.length < 8) return res.json({ success: false, message: 'Password must be at least 8 characters' })
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    user.resetOtp = ''
    user.resetOtpExpireAt = 0
    await user.save()
    res.json({ success: true, message: 'Password reset successful' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, changeUserPassword, googleLogin, verifyEmailOtp, forgotPassword, resetPassword }