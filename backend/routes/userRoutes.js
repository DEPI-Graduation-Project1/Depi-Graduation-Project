import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing in environment variables');
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '40h' },
      (err, token) => {
        if (err) {
          console.error("JWT Sign Error:", err);
          return res.status(500).send("Server Error during token generation");
        }
        
        res.status(201).json({ 
          user: { id: user.id, name: user.name, email: user.email, role: user.role }, 
          token 
        });
      }
    );

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("Server Error");
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt for email:", email);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing!");
      return res.status(500).json({ message: "JWT_SECRET is missing in environment variables" });
    }

    let user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    console.log("User found, checking password...");
    
    if (!user.password) {
      console.error("User password is missing!");
      return res.status(500).json({ message: "User password not found in database" });
    }

    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    console.log("Password matched, generating token...");
    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '40h' },
      (err, token) => {
        if (err) {
          console.error("JWT Sign Error:", err);
          return res.status(500).json({ message: "Server Error during token generation" });
        }
        console.log("Login successful for user:", email);
        res.json({ 
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token 
        });
      }
    );

  } catch (error) {
    console.error("Login Error Details:", error);
    console.error("Error Stack:", error.stack);
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


router.get('/profile' ,protect, async (req, res) => {
  res.json(req.user);
});







export default router;