require('dotenv').config();
require('express-async-errors'); // Handle async errors automatically

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const winston = require('winston');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

const { sequelize } = require('./models');
const metrics = require('./services/metrics');
// initialize passport strategy before routes are loaded
require('./passport');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const ideasRoutes = require('./routes/ideas');
const adminRoutes = require('./routes/admin');

// Logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console({ format: winston.format.simple() })]
});

const app = express();
// CORS configuration for development and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://188.245.198.116:5173', // Server IP address
  'http://188.245.198.116:3001',
  // Add your production frontend URLs here:
  process.env.FRONTEND_URL,
  process.env.PRODUCTION_FRONTEND_URL
].filter(Boolean); // Remove undefined values

const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow REST clients and curl with no origin (for server-to-server)
    if (!origin) return callback(null, true);
    
    // Allow any origin in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Check whitelist in production
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    return callback(new Error('CORS not allowed from origin: ' + origin));
  },
  credentials: true
});
// Apply CORS only for API routes
app.use('/api', corsMiddleware);
app.use(bodyParser.json());

// HTTP request logging
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Prometheus metrics middleware
app.use(metrics.metricsMiddleware);

// Metrics endpoint (public, no auth required)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
});

// PostgreSQL pool for session store
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Session configuration with PostgreSQL store
app.use(session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: false, // Set to false for HTTP, true for HTTPS
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Serve frontend static files if the build exists
const distPath = path.join(__dirname, '..', '..', 'my-vue-app', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback: serve index.html for any unknown route (so client-side routing works)
  app.get('*', (req, res, next) => {
    // let API routes pass through
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: '42 Idea API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      admin: '/api/admin'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler (must be after all routes)
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', { error: err.message, stack: err.stack, path: req.path });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.sync({ alter: true });
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on http://0.0.0.0:${PORT}`);
      console.log(`Access via: http://188.245.198.116:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
