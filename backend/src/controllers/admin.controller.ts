import { Request, Response } from 'express';
import prisma from '../config/db';

export const getSystemStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    
    // Revenue sum from success transactions
    const successPayments = await prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true },
    });
    const totalRevenue = successPayments.reduce((acc, curr) => acc + curr.amount, 0);

    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'ACTIVE', plan: 'PREMIUM' },
    });

    const totalAIRequests = await prisma.aIRequestLog.count();

    // Popular AI tools aggregation
    const logs = await prisma.aIRequestLog.findMany({
      select: { toolUsed: true },
    });

    const toolCounts: Record<string, number> = {};
    logs.forEach((log) => {
      toolCounts[log.toolUsed] = (toolCounts[log.toolUsed] || 0) + 1;
    });

    const popularTools = Object.keys(toolCounts).map((name) => ({
      name,
      requests: toolCounts[name],
    })).sort((a, b) => b.requests - a.requests).slice(0, 5);

    // AI requests history (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentLogs = await prisma.aIRequestLog.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true },
    });

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

    const dailyRequests = Object.keys(dayCounts).map((date) => ({
      date,
      count: dayCounts[date],
    })).reverse();

    return res.status(200).json({
      metrics: {
        totalUsers,
        totalRevenue,
        activeSubscriptions,
        totalAIRequests,
      },
      popularTools,
      dailyRequests,
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    return res.status(500).json({ error: 'Failed to retrieve admin statistics.' });
  }
};

export const getUsersList = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
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
    });

    const usersWithPlan = users.map((u) => ({
      ...u,
      plan: u.subscriptions[0]?.plan || 'FREE',
    }));

    return res.status(200).json(usersWithPlan);
  } catch (error) {
    console.error('Get users list error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user accounts.' });
  }
};

export const updateUserCredits = async (req: Request, res: Response) => {
  const { userId, credits } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { credits: parseInt(credits, 10) },
    });

    return res.status(200).json({ message: 'User credits updated successfully.', userId, credits: updated.credits });
  } catch (error) {
    console.error('Update user credits error:', error);
    return res.status(500).json({ error: 'Failed to adjust user credits.' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id },
    });
    return res.status(200).json({ message: 'User account deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Failed to delete user account.' });
  }
};
