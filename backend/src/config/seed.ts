import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient, Role, Plan, SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with sole Admin account...');

  // Clean existing demo users and records if present
  const demoEmails = ['admin@skillforge.ai', 'user@skillforge.ai'];
  for (const demoEmail of demoEmails) {
    const demoUser = await prisma.user.findUnique({ where: { email: demoEmail } });
    if (demoUser) {
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
    }
  }

  // Create or Update Admin: sparshchauhan050@gmail.com
  const adminEmail = 'sparshchauhan050@gmail.com'.toLowerCase();
  const adminPassword = await bcrypt.hash('Sp@080806', 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { subscriptions: true }
  });

  let admin;
  if (existingAdmin) {
    admin = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        password: adminPassword,
        name: 'Sparsh Chauhan',
        role: Role.ADMIN,
        isVerified: true,
        credits: 99999,
      }
    });

    const activeSub = existingAdmin.subscriptions.find((s) => s.status === SubscriptionStatus.ACTIVE);
    if (!activeSub) {
      await prisma.subscription.create({
        data: {
          userId: admin.id,
          plan: Plan.PREMIUM,
          status: SubscriptionStatus.ACTIVE,
          startDate: new Date(),
        }
      });
    }
  } else {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: adminPassword,
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
  }

  // Demote any other accounts that have Role.ADMIN
  await prisma.user.updateMany({
    where: {
      role: Role.ADMIN,
      email: { not: adminEmail },
    },
    data: {
      role: Role.USER,
    },
  });

  console.log('✓ Sole Admin user configured successfully:', { email: admin.email, role: admin.role });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
