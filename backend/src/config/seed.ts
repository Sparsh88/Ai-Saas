import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient, Role, Plan, SubscriptionStatus, PaymentStatus, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding with Rich Demo & Admin Data ---');

  // 1. Setup Admin Account: sparshchauhan050@gmail.com
  const adminEmail = 'sparshchauhan050@gmail.com'.toLowerCase();
  const adminPassword = await bcrypt.hash('Sp@080806', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPassword,
      name: 'Sparsh Chauhan',
      role: Role.ADMIN,
      isVerified: true,
      credits: 99999,
    },
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Sparsh Chauhan',
      role: Role.ADMIN,
      isVerified: true,
      credits: 99999,
    },
  });

  // Ensure Admin active PREMIUM subscription
  const adminSub = await prisma.subscription.findFirst({ where: { userId: adminUser.id } });
  if (!adminSub) {
    await prisma.subscription.create({
      data: {
        userId: adminUser.id,
        plan: Plan.PREMIUM,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
      },
    });
  }

  console.log(`✓ Primary Admin User configured: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. Setup Secondary Demo Admin: admin@skillforge.ai
  const demoAdminEmail = 'admin@skillforge.ai'.toLowerCase();
  const demoAdminPass = await bcrypt.hash('admin123', 10);
  const demoAdminUser = await prisma.user.upsert({
    where: { email: demoAdminEmail },
    update: {
      password: demoAdminPass,
      name: 'SkillForge Demo Admin',
      role: Role.ADMIN,
      isVerified: true,
      credits: 99999,
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

  console.log(`✓ Demo Admin User configured: ${demoAdminUser.email} (Role: ${demoAdminUser.role})`);

  // 3. Setup Demo Regular Users
  const demoUsersData = [
    {
      email: 'alex.dev@skillforge.ai',
      name: 'Alex Rivera',
      role: Role.USER,
      plan: Plan.PREMIUM,
      credits: 150,
    },
    {
      email: 'sarah.designer@skillforge.ai',
      name: 'Sarah Chen',
      role: Role.USER,
      plan: Plan.FREE,
      credits: 35,
    },
    {
      email: 'michael.lead@skillforge.ai',
      name: 'Michael Davis',
      role: Role.USER,
      plan: Plan.PREMIUM,
      credits: 220,
    },
    {
      email: 'priya.ai@skillforge.ai',
      name: 'Priya Sharma',
      role: Role.USER,
      plan: Plan.FREE,
      credits: 10,
    },
  ];

  const defaultUserPass = await bcrypt.hash('demo123', 10);
  const createdDemoUsers = [];

  for (const u of demoUsersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        password: defaultUserPass,
        name: u.name,
        role: u.role,
        isVerified: true,
        credits: u.credits,
      },
      create: {
        email: u.email,
        password: defaultUserPass,
        name: u.name,
        role: u.role,
        isVerified: true,
        credits: u.credits,
      },
    });

    const existingSub = await prisma.subscription.findFirst({ where: { userId: user.id } });
    if (!existingSub) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: u.plan,
          status: SubscriptionStatus.ACTIVE,
          startDate: new Date(),
        },
      });
    }
    createdDemoUsers.push(user);
  }

  console.log(`✓ Seeded ${createdDemoUsers.length} Demo Users`);

  // 4. Seed Sample Projects and Tasks for Admin
  const existingProject = await prisma.project.findFirst({ where: { userId: adminUser.id } });
  let adminProject = existingProject;
  if (!adminProject) {
    adminProject = await prisma.project.create({
      data: {
        name: 'SkillForge AI Core Platform',
        description: 'Enterprise AI workspace integration and telemetry system',
        userId: adminUser.id,
        tasks: {
          create: [
            {
              title: 'Optimize Gemini 1.5 Flash streaming response latency',
              description: 'Implement chunk-level buffering and token caching',
              status: TaskStatus.DONE,
              priority: TaskPriority.HIGH,
            },
            {
              title: 'Integrate ATS resume keyword semantic density scorer',
              description: 'Compare applicant skills with JD benchmark vectors',
              status: TaskStatus.IN_PROGRESS,
              priority: TaskPriority.HIGH,
            },
            {
              title: 'Deploy Razorpay automated invoice webhooks',
              description: 'Audit cryptographic HMAC signatures on order completion',
              status: TaskStatus.TODO,
              priority: TaskPriority.MEDIUM,
            },
            {
              title: 'Build voice-enabled mock interview analysis pipeline',
              description: 'Analyze WPM speaking cadence and filler word frequency',
              status: TaskStatus.DONE,
              priority: TaskPriority.HIGH,
            },
          ],
        },
      },
    });
    console.log('✓ Seeded Admin Sample Project & Tasks');
  }

  // 5. Seed Sample Documents for Admin
  const existingDoc = await prisma.document.findFirst({ where: { userId: adminUser.id } });
  if (!existingDoc) {
    await prisma.document.create({
      data: {
        name: 'SkillForge_Architecture_Overview.pdf',
        url: 'https://skillforge.ai/docs/architecture.pdf',
        fileType: 'application/pdf',
        textContent: 'SkillForge AI Architecture: React 19 Frontend with Zustand state management. Express.js REST API with Redis/In-Memory Cache layers. Google Gemini 1.5 Flash LLM context injection. PostgreSQL database with Prisma ORM atomic transactions.',
        userId: adminUser.id,
      },
    });
    console.log('✓ Seeded Admin Sample Document');
  }

  // 6. Seed Sample Payments for Revenue Telemetry
  const paymentCount = await prisma.payment.count();
  if (paymentCount < 5) {
    const allUsers = [adminUser, demoAdminUser, ...createdDemoUsers];
    const samplePayments = [
      { amount: 499, status: PaymentStatus.SUCCESS, plan: Plan.PREMIUM, daysAgo: 6 },
      { amount: 999, status: PaymentStatus.SUCCESS, plan: Plan.PREMIUM, daysAgo: 5 },
      { amount: 499, status: PaymentStatus.SUCCESS, plan: Plan.PREMIUM, daysAgo: 4 },
      { amount: 1499, status: PaymentStatus.SUCCESS, plan: Plan.PREMIUM, daysAgo: 3 },
      { amount: 999, status: PaymentStatus.SUCCESS, plan: Plan.PREMIUM, daysAgo: 2 },
      { amount: 1999, status: PaymentStatus.SUCCESS, plan: Plan.PREMIUM, daysAgo: 1 },
      { amount: 499, status: PaymentStatus.SUCCESS, plan: Plan.PREMIUM, daysAgo: 0 },
    ];

    for (let i = 0; i < samplePayments.length; i++) {
      const p = samplePayments[i];
      const targetUser = allUsers[i % allUsers.length];
      const paymentDate = new Date();
      paymentDate.setDate(paymentDate.getDate() - p.daysAgo);

      await prisma.payment.create({
        data: {
          userId: targetUser.id,
          amount: p.amount,
          currency: 'INR',
          status: p.status,
          plan: p.plan,
          razorpayOrderId: `order_seed_${Date.now()}_${i}`,
          razorpayPaymentId: `pay_seed_${Date.now()}_${i}`,
          razorpaySignature: `sig_seed_${Date.now()}_${i}`,
          createdAt: paymentDate,
        },
      });
    }
    console.log('✓ Seeded Demo Payments for Revenue Analytics');
  }

  // 7. Seed Sample AI Request Logs across 7 days
  const logCount = await prisma.aIRequestLog.count();
  if (logCount < 20) {
    const tools = [
      'ATS Resume Scorer',
      'AI Mock Interview',
      'Career Roadmap Planner',
      'Document Q&A Context',
      'SQL Query Generator',
      'Code Explainer & Fixer',
      'Cover Letter Generator',
    ];

    const allUsers = [adminUser, demoAdminUser, ...createdDemoUsers];

    for (let day = 0; day < 7; day++) {
      const requestCountForDay = 5 + Math.floor(Math.random() * 8);
      for (let r = 0; r < requestCountForDay; r++) {
        const randomTool = tools[Math.floor(Math.random() * tools.length)];
        const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
        const logDate = new Date();
        logDate.setDate(logDate.getDate() - day);
        logDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        await prisma.aIRequestLog.create({
          data: {
            userId: randomUser.id,
            toolUsed: randomTool,
            creditsUsed: Math.floor(Math.random() * 3) + 1,
            status: 'SUCCESS',
            createdAt: logDate,
          },
        });
      }
    }
    console.log('✓ Seeded 7-Day AI Request Logs for Admin Analytics');
  }

  console.log('====================================================');
  console.log('🎉 Database seeding completed successfully!');
  console.log('Admin Credential 1: sparshchauhan050@gmail.com / Sp@080806');
  console.log('Admin Credential 2: admin@skillforge.ai / admin123');
  console.log('Demo User Credential: alex.dev@skillforge.ai / demo123');
  console.log('====================================================');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
