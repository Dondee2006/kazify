import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './config/logger';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

// Load config early
dotenv.config();

import authRoutes from './routes/authRoutes';
import gigRoutes from './routes/gigRoutes';
import requestRoutes from './routes/requestRoutes';
import paymentRoutes from './routes/paymentRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Security Headers & CORS
app.use(helmet());
app.use(cors({
  origin: '*', // For development, allow request forwarding. Can be restricted to client domains in production.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-bypass-firebase-id', 'x-bypass-firebase-email', 'x-bypass-firebase-name', 'x-onboarding-role']
}));

// 2. Custom JSON Parser preserving raw body buffer for Stripe signatures
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));

// 3. API rate limiting
app.use('/api/', apiLimiter);

// 4. Mapped routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);

// Base sanity check route
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 5. Global Exception Handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Kazify Production Backend successfully started at http://localhost:${PORT}`);
  logger.info(`Environment mode: ${process.env.NODE_ENV}`);
});
