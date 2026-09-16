import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import verifyRouter from './routes/verify.js';
import clientRouter from './routes/client.js';
import adminRouter from './routes/admin.js';
import leadsRouter from './routes/leads.js';
import feedbackRouter from './routes/feedback.js';
import chatRouter from './routes/chat.js';
import analyticsRouter from './routes/analytics.js';
import db from './db/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ==============================================================================
// MIDDLEWARE
// ==============================================================================
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // In development or production, allow the client URL or local host
      if (
        origin === CLIENT_URL ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive default for frictionless deployment
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ==============================================================================
// ROUTES
// ==============================================================================

// Root Info Route
app.get('/', (req, res) => {
  res.json({
    studio: 'ANURGO — Creative Digital Experiences',
    founder: 'Anurag Chauhan',
    status: 'online',
    version: '1.0.0',
    documentation: 'See FULLSTACK_README.md in repository root',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      verify: '/api/verify',
      client: '/api/client',
      admin: '/api/admin',
      leads: '/api/leads',
      feedback: '/api/feedback',
      chat: '/api/chat',
      analytics: '/api/analytics/stats',
    },
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  try {
    const leadCount = db.prepare('SELECT COUNT(*) as c FROM leads').get().c;
    const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected (SQLite)',
      totalLeads: leadCount,
      totalUsers: userCount,
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// Resource Routers
app.use('/api/auth', authRouter);
app.use('/api/verify', verifyRouter);
app.use('/api/client', clientRouter);
app.use('/api/admin', adminRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/chat', chatRouter);
app.use('/api/analytics', analyticsRouter);

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error.',
  });
});

// ==============================================================================
// SERVER START
// ==============================================================================
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 ANURGO Backend Server is running on port ${PORT}`);
  console.log(`📡 Local API:     http://localhost:${PORT}`);
  console.log(`💓 Health check: http://localhost:${PORT}/api/health`);
  console.log(`✨ Connected to:  ${CLIENT_URL}`);
  console.log(`======================================================\n`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    try {
      db.close();
    } catch {}
  });
});

export default app;
