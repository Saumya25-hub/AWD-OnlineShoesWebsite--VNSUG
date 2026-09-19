const Brand = require('../models/Brand');
const fs = require('fs');
const path = require('path');

const INITIAL_BRANDS = [
  {
    name: 'Nike',
    slug: 'nike',
    logo: '/brands/nike.svg',
    description: 'Just Do It — World leading athletic, running & sports footwear.'
  },
  {
    name: 'Adidas',
    slug: 'adidas',
    logo: '/brands/adidas.svg',
    description: 'Impossible Is Nothing — Iconic lifestyle sneakers and high-performance shoes.'
  },
  {
    name: 'Puma',
    slug: 'puma',
    logo: '/brands/puma.svg',
    description: 'Forever Faster — Cutting-edge dynamic trainers and athletic sports shoes.'
  },
  {
    name: 'Clarks',
    slug: 'clarks',
    logo: '/brands/clarks.svg',
    description: 'Heritage Craftsmanship — Premium handcrafted leather formal and oxford shoes.'
  },
  {
    name: 'Converse',
    slug: 'converse',
    logo: '/brands/converse.svg',
    description: 'Timeless Streetwear — Authentic canvas low-top & skate sneakers.'
  },
  {
    name: 'Skechers',
    slug: 'skechers',
    logo: '/brands/skechers.svg',
    description: 'Comfort Revolution — Ultra-light cushioned walking and cross-training shoes.'
  },
  {
    name: 'Woodland',
    slug: 'woodland',
    logo: '/brands/woodland.svg',
    description: 'Explore the Outdoors — Heavy-duty trekking boots and genuine suede loafers.'
  }
];

// @desc    Get all shoe brands (auto-seed defaults if collection empty)
// @route   GET /api/brands
// @access  Public
const getAllBrands = async (req, res) => {
  try {
    let count = await Brand.countDocuments();
    if (count === 0) {
      await Brand.insertMany(INITIAL_BRANDS);
    }
    const brands = await Brand.find().sort({ createdAt: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single brand by ID or slug
// @route   GET /api/brands/:id
// @access  Public
const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    let brand = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      brand = await Brand.findById(id);
    }
    if (!brand) {
      brand = await Brand.findOne({
        $or: [
          { slug: id.toLowerCase() },
          { name: { $regex: new RegExp(`^${id}$`, 'i') } }
        ]
      });
    }

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = async (req, res) => {
  try {
    const { name, description, slug } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Please provide brand name' });
    }

    const brandExists = await Brand.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    if (brandExists) {
      return res.status(400).json({ message: 'Brand with this name already exists' });
    }

    let logo = '';
    if (req.file) {
      logo = req.file.filename;
    } else if (req.body.logo) {
      logo = req.body.logo;
    }

    const brand = await Brand.create({
      name: name.trim(),
      slug: slug ? slug.trim().toLowerCase() : undefined,
      description: description ? description.trim() : '',
      logo
    });

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const { name, description, slug, logo } = req.body;

    if (name && name.trim() !== brand.name) {
      const brandExists = await Brand.findOne({
        _id: { $ne: brand._id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
      });
      if (brandExists) {
        return res.status(400).json({ message: 'Another brand with this name already exists' });
      }
      brand.name = name.trim();
    }

    if (description !== undefined) brand.description = description.trim();
    if (slug) brand.slug = slug.trim().toLowerCase();

    if (req.file) {
      // Remove previous uploaded logo if local
      if (brand.logo && !brand.logo.startsWith('/') && !brand.logo.startsWith('http')) {
        const oldPath = path.join(__dirname, '../uploads', brand.logo);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) {}
        }
      }
      brand.logo = req.file.filename;
    } else if (logo !== undefined) {
      brand.logo = logo;
    }

    const updated = await brand.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    if (brand.logo && !brand.logo.startsWith('/') && !brand.logo.startsWith('http')) {
      const oldPath = path.join(__dirname, '../uploads', brand.logo);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) {}
      }
    }

    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
};
