import userModel from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";

export const saveAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const userId = req.body.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Add new address to saved addresses array
        user.savedAddresses.push(address);
        await user.save();

        res.status(200).json({
            success: true,
            addresses: user.savedAddresses
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAddresses = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            addresses: user.savedAddresses || [],
            primaryAddress: user.primaryAddress || {}
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const setPrimaryAddress = async (req, res) => {
    try {
        const userId = req.body.userId
        const addressIndex = req.body.addressIndex
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        if (!user.savedAddresses[addressIndex]) {
            return res.status(400).json({ success: false, message: 'Invalid address index' })
        }
        user.primaryAddress = user.savedAddresses[addressIndex]
        await user.save()
        res.status(200).json({ success: true, primaryAddress: user.primaryAddress })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const editAddress = async (req, res) => {
  try {
    const { userId, addressIndex, address } = req.body
    const user = await userModel.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    if (!user.savedAddresses[addressIndex]) return res.status(400).json({ success: false, message: 'Invalid address index' })
    user.savedAddresses[addressIndex] = address
    await user.save()
    res.status(200).json({ success: true, addresses: user.savedAddresses })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const removeAddress = async (req, res) => {
  try {
    const { userId, addressIndex } = req.body
    const user = await userModel.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    if (!user.savedAddresses[addressIndex]) return res.status(400).json({ success: false, message: 'Invalid address index' })
    const removed = user.savedAddresses.splice(addressIndex, 1)
    // If the removed address was primary, clear or set a new primary
    if (JSON.stringify(user.primaryAddress) === JSON.stringify(removed[0])) {
      user.primaryAddress = user.savedAddresses[0] || {}
    }
    await user.save()
    res.status(200).json({ success: true, addresses: user.savedAddresses, primaryAddress: user.primaryAddress })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
