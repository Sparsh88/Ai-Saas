import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient, Role, Plan, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const rawUrl = process.env.DATABASE_URL || '';
const cleanUrl = rawUrl.replace('&channel_binding=require', '').replace('?channel_binding=require', '');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: cleanUrl,
    },
  },
});

async function main() {
  console.log('--- Setting up Sole Admin & Purging Demo Credentials ---');

  const adminEmail = 'sparshchauhan050@gmail.com'.toLowerCase();
  const adminPassPlain = 'Sp@080806';
  const hashedPassword = await bcrypt.hash(adminPassPlain, 10);

  // 1. Check or Upsert Admin User
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { subscriptions: true },
  });

  let adminUser;
  if (existingAdmin) {
    console.log(`Found existing user for ${adminEmail}. Updating credentials and admin permissions...`);
    adminUser = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        password: hashedPassword,
        role: Role.ADMIN,
        isVerified: true,
        credits: 99999,
        name: existingAdmin.name || 'Sparsh Chauhan',
      },
    });

    // Ensure active PREMIUM subscription
    const activeSub = existingAdmin.subscriptions.find((s) => s.status === SubscriptionStatus.ACTIVE);
    if (!activeSub) {
      await prisma.subscription.create({
        data: {
          userId: adminUser.id,
          plan: Plan.PREMIUM,
          status: SubscriptionStatus.ACTIVE,
          startDate: new Date(),
        },
      });
    }
  } else {
    console.log(`Creating new Admin user for ${adminEmail}...`);
    adminUser = await prisma.user.create({
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
          },
        },
      },
    });
  }

  console.log(`✓ Admin user successfully configured: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. Demote any other accounts that might have Role.ADMIN to Role.USER
  const demoted = await prisma.user.updateMany({
    where: {
      role: Role.ADMIN,
      email: { not: adminEmail },
    },
    data: {
      role: Role.USER,
    },
  });
  if (demoted.count > 0) {
    console.log(`✓ Demoted ${demoted.count} other admin account(s) to USER.`);
  }

  // 3. Delete demo accounts (admin@skillforge.ai, user@skillforge.ai) and their associated records
  const demoEmails = ['admin@skillforge.ai', 'user@skillforge.ai'];
  for (const demoEmail of demoEmails) {
    const demoUser = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    if (demoUser) {
      console.log(`Purging demo user: ${demoEmail}...`);
      await prisma.notification.deleteMany({ where: { userId: demoUser.id } });
      await prisma.aIRequestLog.deleteMany({ where: { userId: demoUser.id } });
      await prisma.message.deleteMany({ where: { chat: { userId: demoUser.id } } });
      await prisma.chat.deleteMany({ where: { userId: demoUser.id } });
      await prisma.document.deleteMany({ where: { userId: demoUser.id } });
      await prisma.task.deleteMany({ where: { project: { userId: demoUser.id } } });
      await prisma.project.deleteMany({ where: { userId: demoUser.id } });
      await prisma.payment.deleteMany({ where: { userId: demoUser.id } });
      await prisma.subscription.deleteMany({ where: { userId: demoUser.id } });
      await prisma.refreshToken.deleteMany({ where: { userId: demoUser.id } });
      await prisma.user.delete({ where: { id: demoUser.id } });
      console.log(`✓ Purged demo user: ${demoEmail}`);
    }
  }

  console.log('All demo credentials removed and sparshchauhan050@gmail.com is configured as sole admin!');
}

main()
  .catch((e) => {
    console.error('Error setting up admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
