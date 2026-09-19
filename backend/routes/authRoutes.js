const express = require('express');
const router = express.Router();
const {
  getCaptcha,
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/captcha', getCaptcha);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
