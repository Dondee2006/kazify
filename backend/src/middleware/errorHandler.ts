import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error with Winston
  logger.error(`[Global Error] Route: ${req.method} ${req.originalUrl} - Status: ${statusCode} - Message: ${message}`);
  if (err.stack) {
    logger.debug(err.stack);
  }

  // Respond to request
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}
