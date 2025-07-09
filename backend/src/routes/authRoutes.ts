// src/routes/authRoutes.ts
import express from 'express';
import { sendOtp, verifyOtp ,resendOtp} from '../controller/AuthController';

const router = express.Router();

router.post('/send-otp', sendOtp);//to send otp
router.post('/verify-otp', verifyOtp);// to verify otp
router.post('/resend-otp', resendOtp);//to resend opt 

export default router;
