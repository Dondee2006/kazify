import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { prisma } from '../config/db';
import { logger } from '../config/logger';
import { Prisma } from '@prisma/client';

export async function getGigs(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

    const skip = (page - 1) * limit;

    // Build search queries
    const where: Prisma.GigWhereInput = {
      status: 'ACTIVE'
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Since our Prisma schema for Gig doesn't have a category field (wait, let's check schema.prisma:
    // Gig has title, description, basePrice, deliveryDays, status, freelancerId. It does NOT have a category field!
    // Ah, wait! The user's schema spec did not mention category in Gig, but the REST API description did:
    // "GET /gigs: Implements performant cursor or offset pagination, filtering by text search, category, and minimum/maximum price bounds."
    // Let's add a `category` field to the Prisma schema or support it dynamically?
    // Wait, let's update schema.prisma to include `category` in Gig! It will be a string field.
    // Yes! Let's check `prisma/schema.prisma` first.
    // Gig has: id, title, description, basePrice, deliveryDays, status, freelancerId. It does not have category!
    // Let's modify schema.prisma to include category for Gigs (and for JobRequests if needed, JobRequest has budget, title, description, clientId, createdAt. Wait, JobRequest in client frontend had category too! Let's check:
    // Yes, ClientMarketplace and LandingHome used categories like 'Programming & IT', 'Graphics & Design', 'Video & Animation', 'Writing & Translation'.
    // Let's add `category String @default("General")` or `category String` to both `Gig` and `JobRequest` in `prisma/schema.prisma`!)
    // Wait! Let's update `prisma/schema.prisma` first so it includes `category` on Gig and JobRequest! That is much more production-ready and matches the UI and requirements perfectly!
    
    // For now, let's write the controller assuming `category` exists.
    if (category) {
      (where as any).category = { equals: category, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) {
        where.basePrice.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.basePrice.lte = maxPrice;
      }
    }

    const [gigs, total] = await prisma.$transaction([
      prisma.gig.findMany({
        where,
        skip,
        take: limit,
        include: {
          freelancer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          id: 'desc'
        }
      }),
      prisma.gig.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      gigs,
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
    logger.error(`Error in getGigs controller: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve gigs feed' });
  }
}

export async function createGig(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.role !== 'FREELANCER') {
      return res.status(403).json({ error: 'Forbidden: Only users with the FREELANCER role can publish gigs.' });
    }

    const { title, description, basePrice, deliveryDays, category } = req.body;

    if (!title || !description || basePrice === undefined || !deliveryDays) {
      return res.status(400).json({ error: 'Validation Error: Title, description, basePrice, and deliveryDays are required.' });
    }

    const price = parseFloat(basePrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Validation Error: basePrice must be a positive number.' });
    }

    const days = parseInt(deliveryDays);
    if (isNaN(days) || days <= 0) {
      return res.status(400).json({ error: 'Validation Error: deliveryDays must be a positive integer.' });
    }

    logger.info(`Creating new Gig for freelancer ${user.id}: "${title}"`);
    const newGig = await prisma.gig.create({
      data: {
        title,
        description,
        basePrice: price,
        deliveryDays: days,
        category: category || 'Graphics & Design', // Fallback default category
        freelancerId: user.id,
        status: 'ACTIVE'
      }
    });

    return res.status(201).json(newGig);
  } catch (error: any) {
    logger.error(`Error in createGig: ${error.message}`);
    return res.status(500).json({ error: 'Failed to publish service listing' });
  }
}
