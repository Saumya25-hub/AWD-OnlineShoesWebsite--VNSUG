const express = require('express');
const router = express.Router();
const {
  createOrder,
  getRazorpayKey,
  createRazorpayOrderHandler,
  verifyRazorpayPaymentHandler,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Razorpay endpoints
router.get('/razorpay/key', getRazorpayKey);
router.post('/razorpay/create', protect, createRazorpayOrderHandler);
router.post('/razorpay/verify', protect, verifyRazorpayPaymentHandler);

// Standard order endpoints
router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/dashboard-stats', protect, admin, getDashboardStats);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
