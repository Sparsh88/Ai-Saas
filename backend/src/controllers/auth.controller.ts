import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { sendPasswordResetEmail } from '../services/email.service';
import { Role } from '@prisma/client';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'skillforge_super_secret_access_token_12345!';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'skillforge_super_secret_refresh_token_67890!';
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

// Helper to generate tokens
const generateTokens = (userId: string, email: string, role: Role) => {
  const accessToken = jwt.sign({ id: userId, email, role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY as any });
  const refreshToken = jwt.sign({ id: userId, email, role }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY as any });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user pre-verified with FREE plan subscription and 10 credits
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isVerified: true,
        credits: 10,
        subscriptions: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE',
            startDate: new Date(),
          }
        }
      },
    });

    // Generate access & refresh tokens for instant direct login
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

    // Save refresh token to DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return res.status(201).json({
      message: 'Account created successfully. Welcome to SkillForge AI!',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified.' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

    // Save refresh token to DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return res.status(200).json({
      message: 'Email verified successfully. Welcome to SkillForge AI!',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: 'Server error during verification.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          take: 1,
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: 'Please verify your email before logging in.',
        isUnverified: true,
        email: user.email,
      });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

    // Save refresh token to DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const activeSubscription = user.subscriptions[0];

    return res.status(200).json({
      message: 'Login successful.',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        credits: user.credits,
        plan: activeSubscription ? activeSubscription.plan : 'FREE',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login.' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required.' });
  }

  try {
    const savedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!savedToken || savedToken.expiresAt < new Date()) {
      if (savedToken) {
        await prisma.refreshToken.delete({ where: { id: savedToken.id } });
      }
      return res.status(401).json({ error: 'Refresh token expired or invalid.' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: savedToken.user.id, email: savedToken.user.email, role: savedToken.user.role },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRY as any }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: 'Server error during refresh.' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Server error during logout.' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return 200 for security reasons, so email enumeration is harder
      return res.status(200).json({ message: 'If that email is registered, we have sent a reset link.' });
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    await sendPasswordResetEmail(email, user.name, resetToken);

    return res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Server error during forgot password.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Reset token is invalid or has expired.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Server error during password reset.' });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const { token, email: mockEmail, name: mockName } = req.body;

  try {
    let email = mockEmail;
    let name = mockName || 'Google User';

    // If a real token is provided, attempt to decode it (Google ID tokens are JWTs)
    if (token) {
      try {
        const decoded: any = jwt.decode(token);
        if (decoded && decoded.email) {
          email = decoded.email;
          name = decoded.name || decoded.given_name || 'Google User';
        }
      } catch (e) {
        console.warn('Could not decode Google ID token, falling back to body params:', e);
      }
    }

    if (!email) {
      return res.status(400).json({ error: 'Google login requires a valid token or email payload.' });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          take: 1,
        }
      }
    });

    if (!user) {
      // Create a random password for OAuth users since they log in via Google
      const randomPassword = await bcrypt.hash(Math.random().toString(36).substring(2, 15), 10);
      
      user = await prisma.user.create({
        data: {
          email,
          password: randomPassword,
          name,
          isVerified: true, // Google accounts are pre-verified
          credits: 15, // Bonus credits for Google login
          subscriptions: {
            create: {
              plan: 'FREE',
              status: 'ACTIVE',
              startDate: new Date(),
            }
          }
        },
        include: {
          subscriptions: {
            where: { status: 'ACTIVE' },
            take: 1,
          }
        }
      });

      // Create welcome notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome via Google! 🎉',
          message: 'Thank you for signing in with Google. Explore your initial 15 credits.',
        }
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

    // Save refresh token to DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const activeSubscription = user.subscriptions[0];

    return res.status(200).json({
      message: 'Google login successful.',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        credits: user.credits,
        plan: activeSubscription ? activeSubscription.plan : 'FREE',
      },
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(500).json({ error: 'Server error during Google authentication.' });
  }
};
