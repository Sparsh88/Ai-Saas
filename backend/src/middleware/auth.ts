import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  credits: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

// In-memory cache for decoded user identities (30s TTL)
// Avoids 3-4 duplicate database SELECTs on initial page loads with parallel requests
interface CacheEntry {
  user: AuthenticatedUser;
  expiresAt: number;
}

const userAuthCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

export const invalidateUserAuthCache = (userId: string) => {
  userAuthCache.delete(userId);
};

export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token missing or invalid format.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_ACCESS_SECRET || 'skillforge_super_secret_access_token_12345!';
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: Role };

    // Check fast memory cache
    const now = Date.now();
    const cached = userAuthCache.get(decoded.id);
    if (cached && cached.expiresAt > now) {
      req.user = cached.user;
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, credits: true },
    });

    if (!user) {
      userAuthCache.delete(decoded.id);
      return res.status(401).json({ error: 'User associated with token no longer exists.' });
    }

    userAuthCache.set(decoded.id, {
      user,
      expiresAt: now + CACHE_TTL_MS,
    });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token expired or signature invalid.' });
  }
};

export const requireRole = (role: Role) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (role === Role.ADMIN) {
      if (req.user.role !== Role.ADMIN) {
        return res.status(403).json({ error: 'Access forbidden. Insufficient administrator permissions.' });
      }
    } else if (req.user.role !== role && req.user.role !== Role.ADMIN) {
      return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
    }

    next();
  };
};

