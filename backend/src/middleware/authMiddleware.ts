import { Request, Response, NextFunction } from 'express';
import { User, Role } from '@prisma/client';
import { prisma } from '../config/db';
import { admin } from '../config/firebase';
import { logger } from '../config/logger';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

const bypassAuth = process.env.BYPASS_FIREBASE_AUTH === 'true';

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let firebaseId: string | null = null;
    let email = 'unknown@kazify.com';
    let name = 'Kazify User';

    if (bypassAuth) {
      // 1. In development, support mock bypass headers
      const bypassHeader = req.headers['x-bypass-firebase-id'];
      if (bypassHeader) {
        firebaseId = Array.isArray(bypassHeader) ? bypassHeader[0] : bypassHeader;
      } else {
        // Look in authorization header for simulated bearer token
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          if (token.startsWith('mock-')) {
            firebaseId = token;
          }
        }
      }

      // Read other mock metadata headers if provided
      const bypassEmail = req.headers['x-bypass-firebase-email'];
      if (bypassEmail) {
        email = Array.isArray(bypassEmail) ? bypassEmail[0] : bypassEmail;
      } else if (firebaseId) {
        email = `${firebaseId}@kazify-mock.com`;
      }

      const bypassName = req.headers['x-bypass-firebase-name'];
      if (bypassName) {
        name = Array.isArray(bypassName) ? bypassName[0] : bypassName;
      } else if (firebaseId) {
        name = firebaseId.replace('mock-', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    } else {
      // 2. Production Firebase Admin validation
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format. Authorization bearer token required.' });
      }

      const token = authHeader.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      firebaseId = decodedToken.uid;
      email = decodedToken.email || 'unknown@kazify.com';
      name = decodedToken.name || 'Kazify User';
    }

    if (!firebaseId) {
      return res.status(401).json({ error: 'Unauthorized: Unable to resolve authenticated user identity.' });
    }

    // Lookup user in our local PostgreSQL database
    let dbUser = await prisma.user.findUnique({
      where: { firebaseId },
    });

    // Auto-create user if they don't exist yet
    if (!dbUser) {
      logger.info(`Auto-creating new database profile for Firebase ID: ${firebaseId}`);
      // Detect role requested from onboarding headers, fallback to CLIENT
      const requestedRole = req.headers['x-onboarding-role'] as string;
      const finalRole = (requestedRole === 'FREELANCER' || requestedRole === 'CLIENT') 
        ? (requestedRole as Role) 
        : Role.CLIENT;

      dbUser = await prisma.user.create({
        data: {
          firebaseId,
          email,
          name,
          role: finalRole,
          balance: 0.00,
        },
      });
    }

    // Hydrate the request pipeline with the loaded database user
    req.user = dbUser;
    return next();
  } catch (error: any) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({ error: 'Unauthorized: Access token is expired or signature is invalid.' });
  }
}
