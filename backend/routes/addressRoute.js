import express from 'express';
import { saveAddress, getAddresses, setPrimaryAddress, editAddress, removeAddress } from '../controllers/addressController.js';
import authUser from '../middleware/auth.js';

const router = express.Router();

router.post('/save', authUser, saveAddress);
router.get('/get', authUser, getAddresses);
router.post('/set-primary', authUser, setPrimaryAddress);
router.post('/edit', authUser, editAddress);
router.post('/remove', authUser, removeAddress);

export default router; 