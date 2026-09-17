const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Enable CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://easyuverse.shop',
  'https://easyuverse.vercel.app',
  'https://ujjwal.page.gd'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || origin.endsWith('.shop')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SEO & Google Indexing Routes
app.use('/', require('./routes/seoRoutes'));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/showcase', require('./routes/showcaseRoutes'));
app.use('/api/youtube', require('./routes/youtubeRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Root Health Check Route
app.get('/api-status', (req, res) => {
  res.json({
    status: 'ONLINE',
    message: '🚀 Welcome to EasyUVerse Backend API Service by Ujjwal Kant',
    domain: 'https://easyuverse.shop',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Custom Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
