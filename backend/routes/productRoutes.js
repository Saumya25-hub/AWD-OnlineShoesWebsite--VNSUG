const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getBrands,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/brands', getBrands);

router.route('/')
  .get(getAllProducts)
  .post(protect, admin, upload.single('image'), createProduct);

router.patch('/:id/stock', protect, admin, updateProductStock);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('image'), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
