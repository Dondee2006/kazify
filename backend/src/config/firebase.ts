import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { logger } from './logger';

const bypassAuth = process.env.BYPASS_FIREBASE_AUTH === 'true';
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '';

if (bypassAuth) {
  logger.warn('Firebase Authentication is BYPASSED. Simulated headers (x-bypass-firebase-id) will be used.');
} else {
  try {
    if (!serviceAccountPath) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not defined.');
    }

    const absolutePath = path.resolve(serviceAccountPath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Firebase service account file not found at ${absolutePath}`);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    logger.info('Firebase Admin SDK successfully initialized.');
  } catch (error: any) {
    logger.error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
    logger.warn('Fallback: Running with mock authorization. Set BYPASS_FIREBASE_AUTH=true if you do not have credential keys.');
  }
}

export { admin };
