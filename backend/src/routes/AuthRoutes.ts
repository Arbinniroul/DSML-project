import express from 'express';
import { signIn, signUp } from '../controllers/AuthController';


const router = express.Router();

// Define routes
router.post('/register', (req, res) => signUp(req, res));
router.post('/login', (req, res) => signIn(req, res));

export default router;