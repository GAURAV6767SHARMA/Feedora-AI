import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB, getDbStatus } from './config/db.js';
import businessRoutes from './routes/businessRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import demandRoutes from './routes/demandRoutes.js';
import advisorRoutes from './routes/advisorRoutes.js';
import marketingRoutes from './routes/marketingRoutes.js';
import growthRoutes from './routes/growthRoutes.js';
import experimentRoutes from './routes/experimentRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedInitialDemoIfEmpty } from './scripts/seedDemo.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser clients or matching origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
}));

// Rate limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set a 30-second server timeout so AI routes fail fast with a 408 instead of hanging indefinitely
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    if (!res.headersSent) {
      res.status(408).json({ success: false, error: 'Request timed out. Please try again.' });
    }
  });
  next();
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'LocalPulse AI Engine',
    version: '1.0.0',
    database: dbStatus,
    aiProvider: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' 
      ? 'Google Gemini API' 
      : 'LocalPulse Offline Intelligent Fallback Engine'
  });
});

// API Routes
app.use('/api/v1/businesses', businessRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/analysis', analysisRoutes);
app.use('/api/v1/demand', demandRoutes);
app.use('/api/v1/advisor', advisorRoutes);
app.use('/api/v1/recommendations', advisorRoutes);
app.use('/api/v1/marketing', marketingRoutes);
app.use('/api/v1/campaigns', marketingRoutes);
app.use('/api/v1/growth', growthRoutes);
app.use('/api/v1/experiments', experimentRoutes);
app.use('/api/v1/settings', settingsRoutes);

// Central Error Handler
app.use(errorHandler);

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();
  
  // Seed initial demo restaurant data if workspace is clean
  try {
    await seedInitialDemoIfEmpty();
  } catch (err) {
    console.warn('[Seed] Warning seeding demo data:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`  LOCALPULSE AI BACKEND SERVER ONLINE`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`  Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================\n`);
  });
};

startServer();

export default app;
