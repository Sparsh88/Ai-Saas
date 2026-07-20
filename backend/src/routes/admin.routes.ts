import { Router } from 'express';
import { getSystemStats, getUsersList, updateUserCredits, deleteUser } from '../controllers/admin.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// Restrict all routes in this file to ADMIN role
router.use(authenticateJWT);
router.use(requireRole(Role.ADMIN));

router.get('/stats', getSystemStats);
router.get('/users', getUsersList);
router.put('/users/credits', updateUserCredits);
router.delete('/users/:id', deleteUser);

export default router;
