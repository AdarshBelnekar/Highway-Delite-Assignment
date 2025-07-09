// controllers/authController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import sendEmail from '../utils/sendEmail';
import jwt from 'jsonwebtoken';

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, dob } = req.body;

    if (!email || !name || !dob) {
      res.status(400).json({ message: 'All fields required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists!' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendEmail(email, otp);

    const newUser = new User({ name, email, dob, otp });
    await newUser.save();

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', {
      expiresIn: '1d',
    });

    res.status(200).json({ token, name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

// ✅ New: Resend OTP function
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send email
    await sendEmail(email, otp);

    // Update user's OTP
    user.otp = otp;
    await user.save();

    res.status(200).json({ message: 'New OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
};
