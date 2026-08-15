import { Request, Response } from 'express';
import prisma from '../config/db';
import { invalidateUserAuthCache } from '../middleware/auth';
import { invalidateDashboardCache } from './workspace.controller';

// Fast in-memory cache for admin system stats (30s TTL)
interface AdminStatsCache {
  data: any;
  expiresAt: number;
}
let adminStatsCache: AdminStatsCache | null = null;
const ADMIN_STATS_TTL_MS = 30 * 1000;

export const invalidateAdminStatsCache = () => {
  adminStatsCache = null;
};

export const getSystemStats = async (req: Request, res: Response) => {
  const now = Date.now();
  if (adminStatsCache && adminStatsCache.expiresAt > now) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(adminStatsCache.data);
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Parallel SQL aggregations directly at the database engine level
    const [
      totalUsers,
      revenueAggregation,
      activeSubscriptions,
      totalAIRequests,
      popularToolsGrouped,
      recentLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
      }),
      prisma.subscription.count({
        where: { status: 'ACTIVE', plan: 'PREMIUM' },
      }),
      prisma.aIRequestLog.count(),
      // Top 5 popular tools aggregated on DB
      prisma.aIRequestLog.groupBy({
        by: ['toolUsed'],
        _count: { toolUsed: true },
        orderBy: {
          _count: {
            toolUsed: 'desc',
          },
        },
        take: 5,
      }),
      // Only recent 7 days logs
      prisma.aIRequestLog.findMany({
        where: {
          createdAt: { gte: sevenDaysAgo },
        },
        select: { createdAt: true },
      }),
    ]);

    const totalRevenue = revenueAggregation._sum.amount || 0;
    const popularTools = popularToolsGrouped.map((item) => ({
      name: item.toolUsed,
      requests: item._count.toolUsed,
    }));

    // Group logs by day
    const dayCounts: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      dayCounts[dateString] = 0;
    }

    recentLogs.forEach((log) => {
      const dateString = log.createdAt.toISOString().split('T')[0];
      if (dayCounts[dateString] !== undefined) {
        dayCounts[dateString]++;
      }
    });

    const dailyRequests = Object.keys(dayCounts)
      .map((date) => ({
        date,
        count: dayCounts[date],
      }))
      .reverse();

    const responsePayload = {
      metrics: {
        totalUsers,
        totalRevenue,
        activeSubscriptions,
        totalAIRequests,
      },
      popularTools,
      dailyRequests,
    };

    adminStatsCache = {
      data: responsePayload,
      expiresAt: now + ADMIN_STATS_TTL_MS,
    };

    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Get system stats error:', error);
    return res.status(500).json({ error: 'Failed to retrieve admin statistics.' });
  }
};

export const getUsersList = async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50));
  const skip = (page - 1) * limit;

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isVerified: true,
          credits: true,
          createdAt: true,
          subscriptions: {
            where: { status: 'ACTIVE' },
            select: { plan: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    const usersWithPlan = users.map((u) => ({
      ...u,
      plan: u.subscriptions[0]?.plan || 'FREE',
    }));

    res.setHeader('X-Total-Count', total.toString());
    res.setHeader('X-Page', page.toString());
    res.setHeader('X-Limit', limit.toString());

    return res.status(200).json(usersWithPlan);
  } catch (error) {
    console.error('Get users list error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user accounts.' });
  }
};

export const updateUserCredits = async (req: Request, res: Response) => {
  const { userId, credits } = req.body;

  try {
    const parsedCredits = parseInt(credits, 10);
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { credits: parsedCredits },
    });

    invalidateUserAuthCache(userId);
    invalidateDashboardCache(userId);
    invalidateAdminStatsCache();

    return res.status(200).json({
      message: 'User credits updated successfully.',
      userId,
      credits: updated.credits,
    });
  } catch (error) {
    console.error('Update user credits error:', error);
    return res.status(500).json({ error: 'Failed to adjust user credits.' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });

    if (targetUser && targetUser.email.toLowerCase() === 'sparshchauhan050@gmail.com') {
      return res.status(400).json({ error: 'Primary administrator account cannot be deleted.' });
    }

    await prisma.user.delete({
      where: { id },
    });

    invalidateUserAuthCache(id);
    invalidateDashboardCache(id);
    invalidateAdminStatsCache();

    return res.status(200).json({ message: 'User account deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Failed to delete user account.' });
  }
};

