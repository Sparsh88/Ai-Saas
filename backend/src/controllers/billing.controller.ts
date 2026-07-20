import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/db';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpayClient: Razorpay | null = null;
if (razorpayKeyId && razorpayKeySecret) {
  razorpayClient = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
} else {
  console.warn('WARNING: Razorpay credentials are not defined. Running Billing Service in Simulation/Mock mode.');
}

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { amount } = req.body; // In INR (e.g. 499)

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const amountInPaise = Math.round(amount * 100);

    if (razorpayClient) {
      const order = await razorpayClient.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${userId.substring(0, 8)}_${Date.now()}`,
      });

      // Log in DB as pending payment
      await prisma.payment.create({
        data: {
          userId,
          amount: parseFloat(amount),
          currency: 'INR',
          status: 'PENDING',
          razorpayOrderId: order.id,
          plan: 'PREMIUM',
        },
      });

      return res.status(201).json({
        isMock: false,
        keyId: razorpayKeyId,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    }

    // Mock Mode
    const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 12)}`;
    await prisma.payment.create({
      data: {
        userId,
        amount: parseFloat(amount),
        currency: 'INR',
        status: 'PENDING',
        razorpayOrderId: mockOrderId,
        plan: 'PREMIUM',
      },
    });

    return res.status(201).json({
      isMock: true,
      keyId: 'rzp_test_mockKey123',
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Payment initialization failed.' });
  }
};

export const verifyPayment = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    isMockBypass,
  } = req.body;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // 1. Verify Payment
    if (isMockBypass || !razorpayClient) {
      console.log('Validating mock transaction for order:', razorpay_order_id);
    } else {
      // Signature verification
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', razorpayKeySecret || '')
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        // Mark payment failed in DB
        await prisma.payment.update({
          where: { razorpayOrderId: razorpay_order_id },
          data: { status: 'FAILED' },
        });
        return res.status(400).json({ error: 'Invalid payment signature. Transaction failed.' });
      }
    }

    // 2. Fetch payment record
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    if (payment.status === 'SUCCESS') {
      return res.status(200).json({ message: 'Payment already processed successfully.' });
    }

    // 3. Grant credits & create/extend premium subscription (e.g. add 1000 credits for Premium)
    const bonusCredits = 1000;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days premium duration

    await prisma.$transaction([
      // Update Payment status
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCESS',
          razorpayPaymentId: razorpay_payment_id || `pay_mock_${Math.random().toString(36).substring(2, 10)}`,
          razorpaySignature: razorpay_signature || 'mock_signature',
        },
      }),
      // Grant credits to user
      prisma.user.update({
        where: { id: userId },
        data: {
          credits: { increment: bonusCredits },
        },
      }),
      // Create active premium subscription
      prisma.subscription.create({
        data: {
          userId,
          plan: 'PREMIUM',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: expiryDate,
        },
      }),
      // Send notification
      prisma.notification.create({
        data: {
          userId,
          title: 'Upgrade Successful! 🚀',
          message: `Thank you for upgrading to Premium. We have credited ${bonusCredits} credits to your account.`,
        },
      }),
    ]);

    // Retrieve user credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    return res.status(200).json({
      message: 'Payment verified and credits provisioned successfully.',
      credits: user?.credits || 0,
      plan: 'PREMIUM',
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ error: 'Payment verification processing failed.' });
  }
};

export const getTransactions = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve transactions.' });
  }
};
