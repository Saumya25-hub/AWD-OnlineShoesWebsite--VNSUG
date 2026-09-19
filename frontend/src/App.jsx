import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { UserRoute, AdminRoute } from './components/ProtectedRoute';

// Public & User Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Feedback from './pages/Feedback';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import BrandPage from './pages/BrandPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMessages from './pages/admin/AdminMessages';
import AdminReviews from './pages/admin/AdminReviews';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="app-container">
              <div className="global-flow-bg" aria-hidden="true" />
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public Store Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/brand/:brandName" element={<BrandPage />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* User Protected Routes */}
                  <Route element={<UserRoute />}>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success/:id" element={<OrderSuccess />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                  </Route>

                  {/* Admin Protected Routes */}
                  <Route path="/admin" element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="brands" element={<AdminBrands />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="messages" element={<AdminMessages />} />
                      <Route path="reviews" element={<AdminReviews />} />
                    </Route>
                  </Route>

                  {/* 404 Fallback */}
                  <Route
                    path="*"
                    element={
                      <div className="container section-padding" style={{ textAlign: 'center' }}>
                        <h2>404 — Page Not Found</h2>
                        <p style={{ color: 'var(--text-muted)', margin: '14px 0' }}>
                          The requested shoe page does not exist.
                        </p>
                      </div>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
