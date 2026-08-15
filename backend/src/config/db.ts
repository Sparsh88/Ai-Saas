import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

import bcrypt from 'bcrypt';
import { Role, Plan, SubscriptionStatus } from '@prisma/client';

/**
 * Ensures sparshchauhan050@gmail.com is the sole Admin account and cleans up demo accounts
 */
const ensureSoleAdmin = async (): Promise<void> => {
  try {
    const adminEmail = 'sparshchauhan050@gmail.com'.toLowerCase();
    const hashedPassword = await bcrypt.hash('Sp@080806', 10);

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: { subscriptions: true }
    });

    let adminId: string;
    if (existingAdmin) {
      const updated = await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          password: hashedPassword,
          name: existingAdmin.name || 'Sparsh Chauhan',
          role: Role.ADMIN,
          isVerified: true,
          credits: 99999,
        }
      });
      adminId = updated.id;

      const activeSub = existingAdmin.subscriptions.find((s) => s.status === SubscriptionStatus.ACTIVE);
      if (!activeSub) {
        await prisma.subscription.create({
          data: {
            userId: adminId,
            plan: Plan.PREMIUM,
            status: SubscriptionStatus.ACTIVE,
            startDate: new Date(),
          }
        });
      }
    } else {
      const created = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Sparsh Chauhan',
          role: Role.ADMIN,
          isVerified: true,
          credits: 99999,
          subscriptions: {
            create: {
              plan: Plan.PREMIUM,
              status: SubscriptionStatus.ACTIVE,
              startDate: new Date(),
            }
          }
        }
      });
      adminId = created.id;
    }

    // Demote any other accounts with ADMIN role
    await prisma.user.updateMany({
      where: {
        role: Role.ADMIN,
        email: { not: adminEmail },
      },
      data: {
        role: Role.USER,
      },
    });

    // Clean up demo users
    const demoEmails = ['admin@skillforge.ai', 'user@skillforge.ai'];
    for (const demoEmail of demoEmails) {
      const demoUser = await prisma.user.findUnique({ where: { email: demoEmail } });
      if (demoUser) {
        await prisma.notification.deleteMany({ where: { userId: demoUser.id } }).catch(() => {});
        await prisma.aIRequestLog.deleteMany({ where: { userId: demoUser.id } }).catch(() => {});
        await prisma.message.deleteMany({ where: { chat: { userId: demoUser.id } } }).catch(() => {});
        await prisma.chat.deleteMany({ where: { userId: demoUser.id } }).catch(() => {});
        await prisma.document.deleteMany({ where: { userId: demoUser.id } }).catch(() => {});
        await prisma.task.deleteMany({ where: { project: { userId: demoUser.id } } }).catch(() => {});
        await prisma.project.deleteMany({ where: { userId: demoUser.id } }).catch(() => {});
        await prisma.payment.deleteMany({ where: { userId: demoUser.id } }).catch(() => {});
        await prisma.subscription.deleteMany({ where: { userId: demoUser.id } }).catch(() => {});
        await prisma.refreshToken.deleteMany({ where: { userId: demoUser.id } }).catch(() => {});
        await prisma.user.delete({ where: { id: demoUser.id } }).catch(() => {});
      }
    }

    console.log(`🔒 Sole Admin initialized: ${adminEmail} (Role: ADMIN)`);
  } catch (err) {
    console.warn('⚠️ Admin initialization check deferred:', err);
  }
};

/**
 * Pre-warm database connection on server startup to eliminate cold-start latency on first user request.
 */
export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected and connection pool initialized.');
    await ensureSoleAdmin();
  } catch (error) {
    console.error('❌ Database connection initialization failed:', error);
  }
};

export default prisma;

