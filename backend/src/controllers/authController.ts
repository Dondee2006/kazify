import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/db';
import { logger } from '../config/logger';
import { Role } from '@prisma/client';

export async function syncUser(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { role, name, email } = req.body;
    
    const updateData: any = {};
    if (role && (role === 'CLIENT' || role === 'FREELANCER')) {
      updateData.role = role as Role;
    }
    if (name && typeof name === 'string') {
      updateData.name = name;
    }
    if (email && typeof email === 'string') {
      updateData.email = email;
    }

    // Only query database if updates are requested
    if (Object.keys(updateData).length > 0) {
      logger.info(`Updating user metadata for ${user.firebaseId}: ${JSON.stringify(updateData)}`);
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
      return res.json(updatedUser);
    }

    return res.json(user);
  } catch (error: any) {
    logger.error(`Error in syncUser controller: ${error.message}`);
    return res.status(500).json({ error: 'Failed to synchronize user data' });
  }
}
