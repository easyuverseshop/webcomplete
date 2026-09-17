const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve client static files if client/dist exists
const clientDistPath = path.join(__dirname, '../../client/dist');
const clientDistPathAlt = path.join(__dirname, '../client/dist');
let staticPath = null;

if (fs.existsSync(clientDistPath)) {
  staticPath = clientDistPath;
} else if (fs.existsSync(clientDistPathAlt)) {
  staticPath = clientDistPathAlt;
}

if (staticPath) {
  app.use(express.static(staticPath));
}

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
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || origin.endsWith('.shop') || origin.endsWith('.onrender.com')) {
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

// Health Check API Endpoints for Uptime Monitoring (UptimeRobot / Cron-job.org / BetterUptime)
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: '🚀 EasyUVerse Backend Server is healthy and active!',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    service: 'EasyUVerse API Engine'
  });
});

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

// Root Status & Health Check Route to prevent "Cannot GET /" on Render
app.get('/', (req, res) => {
  if (staticPath && fs.existsSync(path.join(staticPath, 'index.html'))) {
    return res.sendFile(path.join(staticPath, 'index.html'));
  }

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EasyUVerse API Service - Online</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; text-align: center; }
        .card { background: #111827; border: 1px solid #1f2937; padding: 2.5rem 2rem; border-radius: 1.25rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); max-width: 500px; width: 100%; }
        .badge { background: #059669; color: #ecfdf5; font-weight: 700; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; }
        .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        h1 { margin: 0 0 0.5rem 0; font-size: 1.85rem; color: #ffffff; font-weight: 700; }
        p { color: #9ca3af; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.75rem; }
        .btn-group { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
        a.btn { color: #38bdf8; text-decoration: none; font-weight: 600; font-size: 0.9rem; background: rgba(56, 189, 248, 0.1); padding: 0.65rem 1.25rem; border-radius: 0.6rem; border: 1px solid rgba(56, 189, 248, 0.25); transition: all 0.2s ease; }
        a.btn:hover { background: rgba(56, 189, 248, 0.2); transform: translateY(-1px); }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge"><span class="dot"></span> System Online</div>
        <h1>EasyUVerse Backend Engine</h1>
        <p>The Express REST API server is running smoothly on Render. Connect your frontend or ping the live health endpoint for keep-alive monitoring.</p>
        <div class="btn-group">
          <a href="/health" class="btn" target="_blank">💚 Health Check (/health)</a>
          <a href="/api-status" class="btn" target="_blank">⚡ API Status</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/api-status', (req, res) => {
  res.json({
    status: 'ONLINE',
    message: '🚀 Welcome to EasyUVerse Backend API Service by Ujjwal Kant',
    domain: 'https://easyuverse.shop',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Catch-all for non-API frontend SPA routes if dist is present
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/sitemap.xml' || req.path === '/robots.txt' || req.path === '/health') {
    return next();
  }
  if (staticPath && fs.existsSync(path.join(staticPath, 'index.html'))) {
    return res.sendFile(path.join(staticPath, 'index.html'));
  }
  next();
});

// Custom Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

