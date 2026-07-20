import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  googleLogin,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validator';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/schemas';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/login', validate(loginSchema), login);
router.post('/google-login', googleLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
