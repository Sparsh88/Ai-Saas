import { Router } from 'express';
import { createOrder, verifyPayment, getTransactions } from '../controllers/billing.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.get('/transactions', getTransactions);

export default router;
