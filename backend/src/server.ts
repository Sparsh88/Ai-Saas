import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import zlib from 'zlib';
import { connectDB } from './config/db';

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
app.use(cors({
  origin: true,
  credentials: true,
}));

// Native Gzip Compression Middleware for API JSON payloads > 1KB
app.use((req: Request, res: Response, next: NextFunction) => {
  const acceptEncoding = (req.headers['accept-encoding'] as string) || '';
  if (!acceptEncoding.includes('gzip')) {
    return next();
  }

  const originalSend = res.send.bind(res);
  res.send = function (body: any) {
    if (res.headersSent) return originalSend(body);

    const contentType = (res.getHeader('Content-Type') as string) || '';
    const isCompressible =
      !contentType ||
      contentType.includes('application/json') ||
      contentType.includes('text/');

    if (isCompressible && body) {
      const buffer = Buffer.isBuffer(body)
        ? body
        : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));

      if (buffer.length >= 1024) {
        zlib.gzip(buffer, (err, compressed) => {
          if (err) {
            return originalSend(body);
          }
          res.setHeader('Content-Encoding', 'gzip');
          res.setHeader('Content-Length', compressed.length);
          return originalSend(compressed);
        });
        return res;
      }
    }
    return originalSend(body);
  };
  next();
});

// Response Time Tracking Header for Performance Audits
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    res.setHeader('X-Response-Time', `${timeInMs}ms`);
  });
  next();
});

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local upload files statically with caching headers
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'), {
    maxAge: '7d',
    etag: true,
  })
);

// API Rate Limiting (200 requests per 15 minutes)
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

// Start Server and Pre-warm Database Connection
app.listen(PORT, async () => {
  console.log(`🚀 SkillForge AI Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  await connectDB();
});

