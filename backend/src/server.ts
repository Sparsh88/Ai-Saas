import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Route imports
import authRoutes from './routes/auth.routes';
import aiRoutes from './routes/ai.routes';
import documentRoutes from './routes/document.routes';
import workspaceRoutes from './routes/workspace.routes';
import billingRoutes from './routes/billing.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows serving local files to frontend easily
}));

// CORS Configuration
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy.'));
    }
  },
  credentials: true,
}));

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local upload files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Rate Limiting (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 SkillForge AI Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
