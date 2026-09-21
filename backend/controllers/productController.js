const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// @desc    Get all products with optional filters (search, category, brand)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const { category, brand, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (brand && brand !== 'all') {
      query.brand = { $regex: new RegExp(`^${brand.trim()}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all distinct brands
// @route   GET /api/products/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands.filter(Boolean).sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name')
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, brand, category, price, stock, sizes, description, isFeatured } = req.body;

    let image = '';
    if (req.file) {
      image = req.file.filename;
    } else if (req.body.image) {
      image = req.body.image;
    } else {
      return res.status(400).json({ message: 'Please upload a product image' });
    }

    // Parse sizes if sent as comma-separated or stringified JSON
    let parsedSizes = ['6', '7', '8', '9', '10', '11'];
    if (sizes) {
      if (typeof sizes === 'string') {
        try {
          parsedSizes = JSON.parse(sizes);
        } catch (e) {
          parsedSizes = sizes.split(',').map((s) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(sizes)) {
        parsedSizes = sizes;
      }
    }

    const product = await Product.create({
      name,
      brand: brand ? brand.trim() : 'Nike',
      category,
      price: Number(price),
      stock: Number(stock) || 0,
      sizes: parsedSizes,
      description,
      image,
      isFeatured: isFeatured === 'true' || isFeatured === true
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name');
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, brand, category, price, stock, sizes, description, isFeatured } = req.body;

    if (name) product.name = name;
    if (brand) product.brand = brand.trim();
    if (category) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (description) product.description = description;
    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    if (sizes) {
      if (typeof sizes === 'string') {
        try {
          product.sizes = JSON.parse(sizes);
        } catch (e) {
          product.sizes = sizes.split(',').map((s) => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(sizes)) {
        product.sizes = sizes;
      }
    }

    if (req.file) {
      // Clean up old image if it was a dynamically uploaded file and not default seeded image
      if (product.image && !product.image.match(/^shoe[1-8]\.jpg$/i)) {
        const oldPath = path.join(__dirname, '../uploads', product.image);
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, () => {});
        }
      }
      product.image = req.file.filename;
    } else if (req.body.image) {
      product.image = req.body.image;
    }

    const updatedProduct = await product.save();
    const populated = await Product.findById(updatedProduct._id).populate('category', 'name');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image file if dynamically uploaded and not default seeded image
    if (product.image && !product.image.match(/^shoe[1-8]\.jpg$/i)) {
      const imgPath = path.join(__dirname, '../uploads', product.image);
      if (fs.existsSync(imgPath)) {
        fs.unlink(imgPath, () => {});
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Quick update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
const updateProductStock = async (req, res) => {
  try {
    const { stock, addStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (addStock !== undefined && !isNaN(addStock)) {
      product.stock = Math.max(0, (product.stock || 0) + Number(addStock));
    } else if (stock !== undefined && !isNaN(stock)) {
      product.stock = Math.max(0, Number(stock));
    } else {
      return res.status(400).json({ message: 'Stock value is required' });
    }

    const updatedProduct = await product.save();
    const populated = await Product.findById(updatedProduct._id).populate('category', 'name');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getBrands,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock
};
