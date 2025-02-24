// controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

// Generate JWT token
const generateToken = (user: IUser): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// User registration
// User registration
export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    res.status(201).json({ token, userId: user._id, name: user.name });
  } catch (error: any) { // Use 'any' or a custom error type here
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message || 'Unknown error' });
  }
};

// controllers/authController.ts
export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message || 'Unknown error' });
  }
};

