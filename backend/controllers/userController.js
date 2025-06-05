import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js';


const createToken=(id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
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
        const {name, phone, email, password} = req.body;

        // checking user alredy exists or not
        const exists = await userModel.findOne({email, phone});
        if (exists) {
            return res.json({success:false, message:"User Already Exists"})
        }
        // validating email formad and strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"please enter a valid email"})
        }
        if (!validator.isMobilePhone(phone)) {
            return res.json({success:false, message:"please enter a valid phone number"})
        }
        if (password.length < 8) {
            return res.json({success:false, message:"please enter a 8 character password"})
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            phone,
            email,
            password:hashedPassword,
        })

        const user = await newUser.save()
        const token = createToken(user._id)

        res.json({success:true, token})


    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
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

export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, changeUserPassword }