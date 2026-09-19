const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const ContactMessage = require('./models/ContactMessage');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await ContactMessage.deleteMany();

    console.log('Creating Admin and Demo User accounts...');
    const adminUser = await User.create({
      name: 'Store Admin',
      email: 'admin@shoestore.com',
      password: 'admin123',
      phone: '9876543210',
      address: 'BCA AWD Project Lab, College Campus',
      role: 'admin'
    });

    const demoUser = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      password: 'user123',
      phone: '9876501234',
      address: '102, Green Avenue, Surat, Gujarat - 395007',
      role: 'user'
    });

    console.log('Creating Shoe Categories...');
    const categories = await Category.insertMany([
      { name: 'Running Shoes', description: 'Lightweight and cushioned running shoes for daily performance.' },
      { name: 'Casual Sneakers', description: 'Stylish and comfortable sneakers for everyday casual wear.' },
      { name: 'Formal Shoes', description: 'Classic handcrafted leather formal shoes for business & events.' },
      { name: 'Sports & Training', description: 'Durable and supportive athletic footwear for fitness & sports.' },
      { name: 'Loafers & Slip-ons', description: 'Comfortable slip-on shoes and elegant loafers.' },
      { name: 'Outdoor & Boots', description: 'Sturdy all-weather trekking boots and high-grip outdoor shoes.' }
    ]);

    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c._id; });

    console.log('Creating Initial Shoe Products...');
    const products = await Product.insertMany([
      {
        name: 'Nike Zoom Speed Pro Running Shoe',
        category: catMap['Running Shoes'],
        price: 3499,
        stock: 15,
        sizes: ['7', '8', '9', '10', '11'],
        description: 'Engineered for responsive cushioning and lightweight breathability. Ideal for marathon training and daily jogging.',
        image: 'shoe1.jpg',
        isFeatured: true
      },
      {
        name: 'Classic Urban White Leather Sneakers',
        category: catMap['Casual Sneakers'],
        price: 2499,
        stock: 20,
        sizes: ['6', '7', '8', '9', '10'],
        description: 'Clean minimalist white leather sneakers featuring durable vulcanized rubber soles and padded collars for all-day ease.',
        image: 'shoe2.jpg',
        isFeatured: true
      },
      {
        name: 'Royal Heritage Brown Oxford Shoes',
        category: catMap['Formal Shoes'],
        price: 3999,
        stock: 12,
        sizes: ['7', '8', '9', '10'],
        description: 'Handcrafted premium leather Oxford shoes with cap-toe detailing and cushioned insoles for formal events and office attire.',
        image: 'shoe3.jpg',
        isFeatured: true
      },
      {
        name: 'AeroGlide Ultra Blue Sports Shoes',
        category: catMap['Running Shoes'],
        price: 2899,
        stock: 18,
        sizes: ['7', '8', '9', '10', '11'],
        description: 'Dynamic sports running shoes with high-traction waffle grip outsole and breathable knit mesh upper.',
        image: 'shoe4.jpg',
        isFeatured: true
      },
      {
        name: 'Milano Suede Tan Slip-on Loafers',
        category: catMap['Loafers & Slip-ons'],
        price: 2799,
        stock: 14,
        sizes: ['7', '8', '9', '10'],
        description: 'Luxurious tan suede penny loafers designed for smart casual wear, weekend outings, and summer leisure.',
        image: 'shoe5.jpg',
        isFeatured: false
      },
      {
        name: 'Apex Trail Waterproof Hiking Boots',
        category: catMap['Outdoor & Boots'],
        price: 4499,
        stock: 10,
        sizes: ['8', '9', '10', '11'],
        description: 'Rugged leather hiking boots equipped with deep-lugged anti-skid rubber outsoles and reinforced ankle support.',
        image: 'shoe6.jpg',
        isFeatured: false
      },
      {
        name: 'Streetwear Canvas Low-Top Sneakers',
        category: catMap['Casual Sneakers'],
        price: 1899,
        stock: 25,
        sizes: ['6', '7', '8', '9', '10'],
        description: 'Timeless black canvas low-top sneakers with contrast white stitching and vulcanized rubber toe protection.',
        image: 'shoe7.jpg',
        isFeatured: true
      },
      {
        name: 'FlexTrain Mesh Cross-Trainer Shoes',
        category: catMap['Sports & Training'],
        price: 3199,
        stock: 16,
        sizes: ['7', '8', '9', '10', '11'],
        description: 'Versatile gym and cross-training athletic shoe with responsive mid-foot stabilization and shock-absorbing foam.',
        image: 'shoe8.jpg',
        isFeatured: true
      }
    ]);

    console.log('Creating Demo Orders...');
    await Order.create({
      user: demoUser._id,
      items: [
        {
          product: products[0]._id,
          name: products[0].name,
          price: products[0].price,
          quantity: 1,
          size: '9',
          image: products[0].image
        },
        {
          product: products[1]._id,
          name: products[1].name,
          price: products[1].price,
          quantity: 1,
          size: '8',
          image: products[1].image
        }
      ],
      shippingAddress: {
        fullName: 'Rahul Sharma',
        phone: '9876501234',
        address: '102, Green Avenue, Near City Mall',
        city: 'Surat',
        postalCode: '395007'
      },
      paymentMethod: 'Cash on Delivery',
      totalAmount: 5998,
      status: 'Processing'
    });

    console.log('Creating Sample Contact Inquiry...');
    await ContactMessage.create({
      name: 'Amit Patel',
      email: 'amit.patel@gmail.com',
      subject: 'Inquiry regarding size availability',
      message: 'Hello, do you have size 12 available for the Royal Heritage Oxford shoes?'
    });

    console.log('Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Admin Account:  email: admin@shoestore.com | pass: admin123');
    console.log('User Account:   email: rahul@gmail.com     | pass: user123');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
