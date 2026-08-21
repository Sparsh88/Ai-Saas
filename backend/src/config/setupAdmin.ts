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
  console.log('--- Setting up Admin Accounts & Demo Credentials ---');

  // 1. Primary Admin: sparshchauhan050@gmail.com
  const adminEmail = 'sparshchauhan050@gmail.com'.toLowerCase();
  const adminPassPlain = 'Sp@080806';
  const hashedPassword = await bcrypt.hash(adminPassPlain, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
      isVerified: true,
      credits: 99999,
      name: 'Sparsh Chauhan',
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Sparsh Chauhan',
      role: Role.ADMIN,
      isVerified: true,
      credits: 99999,
    },
  });

  const activeSub = await prisma.subscription.findFirst({ where: { userId: adminUser.id } });
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

  console.log(`✓ Primary Admin configured: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. Demo Admin: admin@skillforge.ai
  const demoAdminEmail = 'admin@skillforge.ai'.toLowerCase();
  const demoAdminPass = await bcrypt.hash('admin123', 10);
  const demoAdminUser = await prisma.user.upsert({
    where: { email: demoAdminEmail },
    update: {
      password: demoAdminPass,
      role: Role.ADMIN,
      isVerified: true,
      credits: 99999,
      name: 'SkillForge Demo Admin',
    },
    create: {
      email: demoAdminEmail,
      password: demoAdminPass,
      name: 'SkillForge Demo Admin',
      role: Role.ADMIN,
      isVerified: true,
      credits: 99999,
    },
  });

  const demoAdminSub = await prisma.subscription.findFirst({ where: { userId: demoAdminUser.id } });
  if (!demoAdminSub) {
    await prisma.subscription.create({
      data: {
        userId: demoAdminUser.id,
        plan: Plan.PREMIUM,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
      },
    });
  }

  console.log(`✓ Demo Admin configured: ${demoAdminUser.email} (Role: ${demoAdminUser.role})`);
}

main()
  .catch((e) => {
    console.error('Error setting up admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
