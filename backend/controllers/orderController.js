const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const razorpay = require('../config/razorpay');

// @desc    Create new order (Standard / Legacy)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Please provide full shipping details' });
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'Razorpay',
      paymentStatus: 'Pending',
      totalAmount,
      status: 'Pending'
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Razorpay public test key ID
// @route   GET /api/orders/razorpay/key
// @access  Public
const getRazorpayKey = async (req, res) => {
  res.json({ keyId: razorpay.keyId });
};

// @desc    Create Razorpay Order server-side and initialize DB order
// @route   POST /api/orders/razorpay/create
// @access  Private
const createRazorpayOrderHandler = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided in cart' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Please provide full shipping details' });
    }

    // Verify products and calculate total strictly on the server to prevent tampering
    let calculatedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Shoe product not found: ${item.name}` });
      }

      const itemQty = Math.max(1, parseInt(item.quantity, 10) || 1);
      calculatedTotal += dbProduct.price * itemQty;

      verifiedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: itemQty,
        size: item.size || '8',
        image: dbProduct.image
      });
    }

    // Amount in paise: ₹1 = 100 paise
    const amountInPaise = Math.round(calculatedTotal * 100);
    const receipt = `ORD_${Date.now()}`;

    // Call Razorpay API server-side
    const rzpOrder = await razorpay.createRazorpayOrder(amountInPaise, receipt);
    if (!rzpOrder.success) {
      return res.status(500).json({ message: rzpOrder.error || 'Failed to create Razorpay order' });
    }

    // Save pending order in MongoDB
    const order = new Order({
      user: req.user._id,
      items: verifiedItems,
      shippingAddress,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Pending',
      razorpayOrderId: rzpOrder.orderId,
      totalAmount: calculatedTotal,
      status: 'Pending'
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      order: savedOrder,
      razorpayOrderId: rzpOrder.orderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: razorpay.keyId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment signature and mark order as Paid
// @route   POST /api/orders/razorpay/verify
// @access  Private
const verifyRazorpayPaymentHandler = async (req, res) => {
  try {
    const orderId = req.body.orderId || req.body.order_id;
    const razorpayPaymentId = req.body.razorpayPaymentId || req.body.razorpay_payment_id;
    const razorpayOrderId = req.body.razorpayOrderId || req.body.razorpay_order_id;
    const razorpaySignature = req.body.razorpaySignature || req.body.razorpay_signature;

    if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing required Razorpay payment verification parameters' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Perform server-side HMAC-SHA256 signature verification
    const isValid = razorpay.verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (isValid) {
      // Idempotency safety: only update and deduct stock if not already Paid
      if (order.paymentStatus !== 'Paid') {
        order.paymentStatus = 'Paid';
        order.status = 'Processing';
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;
        await order.save();

        // Deduct inventory stock for each product in the order
        for (const item of order.items) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            await product.save();
          }
        }
      }

      res.json({
        success: true,
        message: 'Payment verified and order placed successfully',
        order
      });
    } else {
      order.paymentStatus = 'Failed';
      await order.save();

      res.status(400).json({
        success: false,
        message: 'Razorpay signature verification failed. Payment could not be validated.'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard summary statistics (Admin only)
// @route   GET /api/orders/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Calculate total revenue from delivered / completed / non-cancelled orders
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Recent 5 orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalProducts,
      totalCategories,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getRazorpayKey,
  createRazorpayOrderHandler,
  verifyRazorpayPaymentHandler,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats
};
