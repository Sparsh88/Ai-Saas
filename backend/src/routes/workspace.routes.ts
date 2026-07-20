import { Router } from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
  getNotifications,
  markNotificationRead,
} from '../controllers/workspace.controller';
import { authenticateJWT } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { projectSchema, taskSchema } from '../utils/schemas';

const router = Router();

router.use(authenticateJWT);

// Dashboard stats & Notifications
router.get('/dashboard-stats', getDashboardStats);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

// Projects CRUD
router.get('/projects', getProjects);
router.post('/projects', validate(projectSchema), createProject);
router.put('/projects/:id', validate(projectSchema), updateProject);
router.delete('/projects/:id', deleteProject);

// Tasks CRUD
router.get('/projects/:projectId/tasks', getTasks);
router.post('/projects/:projectId/tasks', validate(taskSchema), createTask);
router.put('/tasks/:id', validate(taskSchema), updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;
