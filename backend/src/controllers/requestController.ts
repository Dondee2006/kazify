import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/db';
import { logger } from '../config/logger';

export async function getJobRequests(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [requests, total] = await prisma.$transaction([
      prisma.jobRequest.findMany({
        skip,
        take: limit,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.jobRequest.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      requests,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error: any) {
    logger.error(`Error in getJobRequests controller: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve job requests feed' });
  }
}

export async function createJobRequest(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.role !== 'CLIENT') {
      return res.status(403).json({ error: 'Forbidden: Only users with the CLIENT role can broadcast job requests.' });
    }

    const { title, description, budget, category } = req.body;

    if (!title || !description || budget === undefined) {
      return res.status(400).json({ error: 'Validation Error: Title, description, and budget are required.' });
    }

    const budgetVal = parseFloat(budget);
    if (isNaN(budgetVal) || budgetVal <= 0) {
      return res.status(400).json({ error: 'Validation Error: budget must be a positive number.' });
    }

    logger.info(`Creating new Job Request for client ${user.id}: "${title}"`);
    const newRequest = await prisma.jobRequest.create({
      data: {
        title,
        description,
        budget: budgetVal,
        category: category || 'Programming & IT',
        clientId: user.id
      }
    });

    return res.status(201).json(newRequest);
  } catch (error: any) {
    logger.error(`Error in createJobRequest: ${error.message}`);
    return res.status(500).json({ error: 'Failed to publish job request' });
  }
}
