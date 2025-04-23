import express from 'express';
import authcontroller from '../controllers/authcontroller.js';

const router = express.Router();

router.get('/', authcontroller.test);
router.post('/store_interview', authcontroller.storeInterviewData);
router.post('/storeTechnicalData', authcontroller.storeTechnicalData);
router.post('/register', authcontroller.registerUser);
router.post('/login', authcontroller.loginUser);
router.get('/profile', authcontroller.getProfile);
router.get('/logout', authcontroller.logoutUser);
router.put('/updateProfile', authcontroller.userProfile);

export default router;