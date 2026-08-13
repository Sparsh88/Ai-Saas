import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/db';

// Lightweight in-memory cache for user dashboard stats (15s TTL)
interface DashboardCacheEntry {
  data: any;
  expiresAt: number;
}
const dashboardCache = new Map<string, DashboardCacheEntry>();
const DASHBOARD_CACHE_TTL_MS = 15 * 1000; // 15 seconds

export const invalidateDashboardCache = (userId?: string) => {
  if (userId) {
    dashboardCache.delete(userId);
  } else {
    dashboardCache.clear();
  }
};

// -------------------------------------------------------------
// Projects CRUD
// -------------------------------------------------------------

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50));
  const skip = (page - 1) * limit;

  try {
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { userId },
        include: {
          tasks: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.project.count({ where: { userId } }),
    ]);

    // Include pagination headers
    res.setHeader('X-Total-Count', total.toString());
    res.setHeader('X-Page', page.toString());
    res.setHeader('X-Limit', limit.toString());

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, description } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const project = await prisma.project.create({
      data: { name, description, userId },
      include: { tasks: true },
    });
    invalidateDashboardCache(userId);
    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const userId = req.user?.id;

  try {
    const project = await prisma.project.findFirst({ where: { id, userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const updated = await prisma.project.update({
      where: { id },
      data: { name, description },
      include: { tasks: true },
    });
    invalidateDashboardCache(userId);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const project = await prisma.project.findFirst({ where: { id, userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await prisma.project.delete({ where: { id } });
    invalidateDashboardCache(userId);
    return res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete project' });
  }
};

// -------------------------------------------------------------
// Tasks CRUD
// -------------------------------------------------------------

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user?.id;

  try {
    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const { projectId } = req.params;
  const { title, description, status, priority, dueDate } = req.body;
  const userId = req.user?.id;

  try {
    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
      },
    });
    invalidateDashboardCache(userId);
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;
  const userId = req.user?.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task || task.project.userId !== userId) {
      return res.status(404).json({ error: 'Task not found or access denied.' });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    invalidateDashboardCache(userId);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task || task.project.userId !== userId) {
      return res.status(404).json({ error: 'Task not found or access denied.' });
    }

    await prisma.task.delete({ where: { id } });
    invalidateDashboardCache(userId);
    return res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete task' });
  }
};

// -------------------------------------------------------------
// User Dashboard / Notifications
// -------------------------------------------------------------

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  // Fast In-Memory Cache Check for Dashboard Stats
  const now = Date.now();
  const cached = dashboardCache.get(userId);
  if (cached && cached.expiresAt > now) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cached.data);
  }

  try {
    // Parallelized optimized database queries with database-level aggregation
    const [user, recentLogs, totalDocs, totalProjects, totalTasks, usageGrouped] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          credits: true,
          subscriptions: {
            where: { status: 'ACTIVE' },
            select: { plan: true, endDate: true },
            take: 1,
          },
        },
      }),
      prisma.aIRequestLog.findMany({
        where: { userId },
        select: {
          id: true,
          toolUsed: true,
          creditsUsed: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.document.count({ where: { userId } }),
      prisma.project.count({ where: { userId } }),
      prisma.task.count({
        where: { project: { userId } },
      }),
      // Database-level GROUP BY aggregation instead of loading all log rows into memory
      prisma.aIRequestLog.groupBy({
        by: ['toolUsed'],
        _sum: { creditsUsed: true },
        where: { userId },
      }),
    ]);

    const activeSubscription = user?.subscriptions[0];
    const usageSummary = usageGrouped.map((g) => ({
      toolUsed: g.toolUsed,
      creditsUsed: g._sum.creditsUsed || 0,
    }));

    const responsePayload = {
      credits: user?.credits || 0,
      plan: activeSubscription ? activeSubscription.plan : 'FREE',
      endDate: activeSubscription ? activeSubscription.endDate : null,
      recentActivity: recentLogs,
      metrics: {
        totalDocs,
        totalProjects,
        totalTasks,
      },
      usageSummary,
    };

    // Store in cache
    dashboardCache.set(userId, {
      data: responsePayload,
      expiresAt: now + DASHBOARD_CACHE_TTL_MS,
    });

    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        message: true,
        read: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markNotificationRead = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const notif = await prisma.notification.findFirst({ where: { id, userId } });
    if (!notif) return res.status(404).json({ error: 'Notification not found' });

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    return res.status(200).json({ message: 'Marked as read' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update notification' });
  }
};

