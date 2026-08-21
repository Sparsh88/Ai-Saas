import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient, TaskStatus, TaskPriority, MessageRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function populateData() {
  console.log('Connecting to database and populating data for sparshchauhan050@gmail.com...');

  const email = 'sparshchauhan050@gmail.com'.toLowerCase();
  const hashedPassword = await bcrypt.hash('Sp@080806', 10);

  // 1. Find or create user
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: 'Sparsh Chauhan',
        password: hashedPassword,
        isVerified: true,
      },
    });
    console.log('✓ Created user:', user.email);
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: 'Sparsh Chauhan',
        password: hashedPassword,
        isVerified: true,
      },
    });
    console.log('✓ Updated user:', user.email);
  }

  const userId = user.id;

  // 2. Clean previous sample workspace data for this user
  await prisma.message.deleteMany({ where: { chat: { userId } } });
  await prisma.chat.deleteMany({ where: { userId } });
  await prisma.task.deleteMany({ where: { project: { userId } } });
  await prisma.project.deleteMany({ where: { userId } });
  await prisma.document.deleteMany({ where: { userId } });
  await prisma.notification.deleteMany({ where: { userId } });
  await prisma.aIRequestLog.deleteMany({ where: { userId } });

  console.log('✓ Cleaned existing items for fresh population.');

  // 3. Projects & Kanban Tasks
  const project1 = await prisma.project.create({
    data: {
      userId,
      name: 'SkillForge AI Platform Development',
      description: 'Building and scaling modern full-stack AI SaaS with React 19, TypeScript, and Gemini 1.5 Flash.',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      userId,
      name: 'Career & Portfolio Acceleration',
      description: 'Resume optimization, technical interview preparation, and full-stack architecture portfolio.',
    },
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: project1.id,
        title: 'Integrate Gemini 1.5 Flash Document Q&A',
        description: 'Context-injected PDF parsing and ground-truth LLM response streaming.',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
      },
      {
        projectId: project1.id,
        title: 'Design Glassmorphism Theme & Dark Mode',
        description: 'Modern aesthetic layout with fluid responsive sidebar and quick actions.',
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
      },
      {
        projectId: project1.id,
        title: 'Optimize React 19 State Management',
        description: 'Refactor client stores with Zustand and memoized selectors for zero re-render lag.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      },
      {
        projectId: project1.id,
        title: 'Web Speech API Voice Mock Interviewer',
        description: 'Continuous speech recognition with WPM and filler-word articulation analysis.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
      },
      {
        projectId: project2.id,
        title: 'ATS Resume Scorer & Keyword Matching',
        description: 'Evaluate technical resume content against Senior Full-Stack job requirements.',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
      },
      {
        projectId: project2.id,
        title: 'Generate 12-Week System Design Roadmap',
        description: 'Distributed caching, high-throughput message brokers, and database partitioning.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      },
      {
        projectId: project2.id,
        title: 'Complete Mock Coding Interview Simulation',
        description: 'Solve hard dynamic programming and graph algorithm challenges with AI grading.',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
      },
    ],
  });
  console.log('✓ Created 2 Projects with 7 Kanban Tasks.');

  // 4. Documents Hub
  await prisma.document.createMany({
    data: [
      {
        userId,
        name: 'Sparsh_Chauhan_Senior_Software_Engineer_Resume.pdf',
        fileType: 'pdf',
        url: 'https://skillforge-ai-demo.storage/resumes/sparsh_resume.pdf',
        textContent: 'Sparsh Chauhan — Senior Full-Stack Engineer & AI SaaS Architect. Expertise in React 19, TypeScript, Node.js, Express, PostgreSQL, Prisma, Redis, Docker, and Gemini 1.5 Flash LLM pipelines. Built high-scale applications handling 100k+ daily requests with 99.99% uptime.',
      },
      {
        userId,
        name: 'AI_SaaS_System_Architecture_Spec.docx',
        fileType: 'docx',
        url: 'https://skillforge-ai-demo.storage/specs/architecture_spec.docx',
        textContent: 'SkillForge AI High-Level Design: Single-page React 19 client communicating with Node.js/Express REST API. PostgreSQL hosted on Neon with Prisma ORM. Authentication via stateless JWT tokens with refresh token rotation. AI reasoning handled via Google Gemini 1.5 Flash.',
      },
      {
        userId,
        name: 'Distributed_Caching_and_Queues_Notes.txt',
        fileType: 'txt',
        url: 'https://skillforge-ai-demo.storage/notes/caching_notes.txt',
        textContent: 'System Design Notes: Cache strategies (Cache-Aside, Write-Through, Write-Behind). Handling cache stampede with distributed mutex locking. RabbitMQ vs Kafka throughput tradeoffs.',
      },
    ],
  });
  console.log('✓ Created 3 Documents in Documents Hub.');

  // 5. AI Chats & Messages
  const chat1 = await prisma.chat.create({
    data: {
      userId,
      name: 'Next.js 15 & React 19 Architecture',
    },
  });

  await prisma.message.createMany({
    data: [
      {
        chatId: chat1.id,
        role: MessageRole.USER,
        content: 'What are the key architectural improvements in Next.js 15 Server Components and Turbopack caching?',
      },
      {
        chatId: chat1.id,
        role: MessageRole.ASSISTANT,
        content: 'Next.js 15 introduces fundamental improvements:\n\n1. **Async Request APIs**: `cookies()`, `headers()`, and `params` are now asynchronous, preventing layout blocking.\n2. **Uncached fetch Defaults**: `fetch` requests are no longer cached by default, providing clear and predictable data flows.\n3. **Turbopack for Dev**: Turbopack is stabilized with near-instant Fast Refresh and incremental compilation.\n4. **React 19 Compatibility**: Native support for Server Actions, `useActionState`, and `useOptimistic` hooks.',
      },
    ],
  });

  const chat2 = await prisma.chat.create({
    data: {
      userId,
      name: 'Senior Full-Stack Resume ATS Evaluation',
    },
  });

  await prisma.message.createMany({
    data: [
      {
        chatId: chat2.id,
        role: MessageRole.USER,
        content: 'Review my resume for a Senior Frontend Architect position. What are the key metrics to highlight?',
      },
      {
        chatId: chat2.id,
        role: MessageRole.ASSISTANT,
        content: 'Your profile has an outstanding ATS benchmark score of **95/100**! ✨\n\n**Top Strengths**:\n- Clear demonstration of full-stack engineering with TypeScript, React 19, and Node.js.\n- Strong focus on end-to-end AI SaaS architecture and database optimization.\n\n**Suggestions**:\n- Quantify performance improvements (e.g., "Reduced bundle size by 38% using code-splitting and dynamic imports").\n- Emphasize automated CI/CD and zero-downtime deployment pipelines.',
      },
    ],
  });
  console.log('✓ Created 2 AI Chat sessions with conversation logs.');

  // 6. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId,
        title: 'Welcome to SkillForge AI! 🚀',
        message: 'Your account is ready with unlimited, unrestricted access to all AI tools, document intelligence, and project Kanban.',
        read: false,
      },
      {
        userId,
        title: 'ATS Resume Scored: 95/100',
        message: 'Your resume analysis completed with top-tier keyword match ratings for Senior Full-Stack Engineering roles.',
        read: false,
      },
      {
        userId,
        title: 'AI Models Operational',
        message: 'Google Gemini 1.5 Flash models are responding with optimal latency and zero rate constraints.',
        read: true,
      },
    ],
  });
  console.log('✓ Created 3 Notifications.');

  // 7. AI Request Telemetry Logs (for Dashboard Charts & Recent Activity)
  const now = new Date();
  await prisma.aIRequestLog.createMany({
    data: [
      {
        userId,
        toolUsed: 'ATS Resume Scorer',
        creditsUsed: 1,
        status: 'SUCCESS',
        createdAt: new Date(now.getTime() - 1000 * 60 * 15), // 15 mins ago
      },
      {
        userId,
        toolUsed: 'Career Roadmap Planner',
        creditsUsed: 1,
        status: 'SUCCESS',
        createdAt: new Date(now.getTime() - 1000 * 60 * 45), // 45 mins ago
      },
      {
        userId,
        toolUsed: 'AI Document Assistant',
        creditsUsed: 1,
        status: 'SUCCESS',
        createdAt: new Date(now.getTime() - 1000 * 60 * 90), // 1.5 hrs ago
      },
      {
        userId,
        toolUsed: 'Mock Interview Simulator',
        creditsUsed: 1,
        status: 'SUCCESS',
        createdAt: new Date(now.getTime() - 1000 * 60 * 180), // 3 hrs ago
      },
      {
        userId,
        toolUsed: 'AI Code Generator',
        creditsUsed: 1,
        status: 'SUCCESS',
        createdAt: new Date(now.getTime() - 1000 * 60 * 360), // 6 hrs ago
      },
      {
        userId,
        toolUsed: 'Cover Letter Maker',
        creditsUsed: 1,
        status: 'SUCCESS',
        createdAt: new Date(now.getTime() - 1000 * 60 * 720), // 12 hrs ago
      },
      {
        userId,
        toolUsed: 'LinkedIn Optimizer',
        creditsUsed: 1,
        status: 'SUCCESS',
        createdAt: new Date(now.getTime() - 1000 * 60 * 1440), // 1 day ago
      },
    ],
  });
  console.log('✓ Created 7 AI telemetry logs for dashboard activity graphs.');

  console.log('🎉 Population completed successfully for sparshchauhan050@gmail.com!');
}

populateData()
  .catch((err) => {
    console.error('Error populating data:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
