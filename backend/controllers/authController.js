const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createCaptcha, verifyCaptcha } = require('../utils/captcha');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'awd_shoes_bca_secret_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Get CAPTCHA image and verification token
// @route   GET /api/auth/captcha
// @access  Public
const getCaptcha = async (req, res) => {
  try {
    const captcha = createCaptcha();
    res.json(captcha);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, captchaInput, captchaToken } = req.body;

    // Verify CAPTCHA
    if (!captchaInput || !captchaToken) {
      return res.status(400).json({ message: 'Please enter CAPTCHA' });
    }
    if (!verifyCaptcha(captchaToken, captchaInput)) {
      return res.status(400).json({ message: 'Invalid CAPTCHA.' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields (Name, Email, Password)' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      address: address || '',
      role: 'user'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, captchaInput, captchaToken } = req.body;

    // Verify CAPTCHA
    if (!captchaInput || !captchaToken) {
      return res.status(400).json({ message: 'Please enter CAPTCHA' });
    }
    if (!verifyCaptcha(captchaToken, captchaInput)) {
      return res.status(400).json({ message: 'Invalid CAPTCHA.' });
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCaptcha,
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser
};
