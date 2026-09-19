# ShoeStore - Online Shoes Store Web Application

A full-stack e-commerce web application for browsing, filtering, and ordering footwear online.

## Tech Stack
- **Frontend:** React, Vite, React Router, Context API, CSS3
- **Backend:** Node.js, Express.js, REST API
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, Bcrypt password encryption

## Features
- User registration and login
- Administrator authentication and management dashboard
- Category filtering and product catalogue
- Shopping cart with real-time quantity adjustments
- Order placement and customer order history tracking
- Contact support form

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
node seed.js    # Seed database with initial products & categories
node server.js  # Starts Express server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Starts Vite dev server on http://localhost:5173
```

### 3. One-Click Launcher
Double-click `RUN_WEEK1.bat` in the project root to start both backend and frontend automatically.
