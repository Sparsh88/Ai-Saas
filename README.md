# SkillForge AI

An intelligent full-stack SaaS platform combining AI-powered career development tools, document intelligence, Kanban project management, and credit-metered Razorpay billing into a unified workspace.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20App-indigo?style=for-the-badge&logo=vercel)](https://ai-saas-blond-zeta.vercel.app)
[![API Status](https://img.shields.io/badge/API-Render%20Online-emerald?style=for-the-badge&logo=render)](https://skillforge-ai-api.onrender.com/health)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## 🌐 Live Demo & Repository

- **Live Frontend**: [https://ai-saas-blond-zeta.vercel.app](https://ai-saas-blond-zeta.vercel.app)
- **Backend API**: [https://skillforge-ai-api.onrender.com](https://skillforge-ai-api.onrender.com)
- **API Health Check**: [https://skillforge-ai-api.onrender.com/health](https://skillforge-ai-api.onrender.com/health)
- **GitHub Repository**: [https://github.com/Sparsh88/Ai-Saas](https://github.com/Sparsh88/Ai-Saas)

---

## 📌 Overview

**SkillForge AI** is a full-stack SaaS web application designed to consolidate fragmented career preparation, document intelligence, and developer productivity utilities into a single, cohesive ecosystem. Built with **React 19, TypeScript, Node.js/Express, Prisma ORM, PostgreSQL (Neon)**, and **Google Gemini 1.5 Flash**, the application provides users with context-aware AI tools alongside Kanban project management and credit-based subscription billing.

The platform addresses the productivity loss caused by context switching between disconnected tools. By uniting document-grounded question answering, ATS resume scoring, voice-enabled mock interviews, career roadmap planning, and task tracking under one interface, SkillForge AI offers a streamlined workflow for students, job seekers, and developers.

---

## 🎯 Problem Statement

1. **Tool Fragmentation**: Job seekers and students routinely switch between disparate single-purpose tools for resume optimization, interview practice, coding assistance, document review, and task tracking.
2. **Lack of Actionable Feedback**: Conventional career platforms provide generic suggestions rather than structured, metric-driven evaluations like ATS keyword matching, speech pace analysis, and filler word counts.
3. **Manual Document Information Extraction**: Reading through lengthy technical PDFs, project specifications, or job postings is time-consuming without context-grounded AI extraction.
4. **SaaS Resource Metering & Monetization**: Building a production-ready SaaS requires robust token authentication, atomic credit deduction mechanisms, rate limiting, and secure payment verification.

---

## ✨ Key Features

### Functional Features

- **AI Document Assistant & Context Q&A**: Upload multi-format documents (PDF, DOCX, TXT) and query their contents directly using Gemini 1.5 Flash context injection without manual searching.
- **ATS Resume Scorer & Breakdown**: Analyzes resume content against industry benchmarks, producing an ATS score (0–100), detected keywords, missing keywords, and targeted formatting feedback.
- **AI Mock Interview & Speech Analysis**: Simulates role-specific technical and behavioral interviews with Web Speech API voice capture, filler word tracking (`um`, `like`), speaking pace (WPM), and model answer comparisons.
- **Career Roadmaps & Study Curricula**: Generates multi-phase technical learning milestones, structured weekly study timetables, interactive mind map nodes, and flashcard decks.
- **Developer & Writing Utilities**: Built-in tools for SQL generation, regex creation, code explanation, bug fixing, cover letter drafting, and professional email generation.
- **Kanban Task & Project Management**: Multi-project task boards supporting `TODO`, `IN_PROGRESS`, and `DONE` states with priority tags (`LOW`, `MEDIUM`, `HIGH`) and real-time status updates.
- **Credit Metering & Razorpay Payments**: Transactional credit accounting per AI tool execution, Razorpay checkout with cryptographic HMAC SHA-256 signature verification, and sandbox simulation fallback.
- **Role-Based Admin Telemetry**: Admin dashboard displaying real-time user management, manual credit adjustment controls, platform revenue tracking, and daily API usage analytics.

### UI / UX Highlights

- **Modern Glassmorphic Interface**: Dark-mode-first aesthetic styled with Tailwind CSS v4 and Framer Motion micro-animations.
- **Visual Analytics**: Interactive telemetry and usage metrics visualized using Recharts.
- **Performance Optimized**: Code-splitting with `React.lazy`, Suspense fallback skeletons, and native server-side Gzip compression.

---

## 🛠 Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite | Component-driven UI, type safety, and fast compilation |
| **Styling & Animation** | Tailwind CSS v4, Framer Motion | Responsive layouts, glassmorphism design, and micro-interactions |
| **Client State** | Zustand | Lightweight state management for auth and workspace state |
| **Data Visualization** | Recharts, Lucide React | Interactive telemetry charts and scalable vector icons |
| **Backend API** | Node.js, Express.js, TypeScript | RESTful routing, middleware pipeline, and controller architecture |
| **Database & ORM** | PostgreSQL (Neon Cloud), Prisma ORM | Relational schema, automated migrations, and type-safe database queries |
| **AI Integration** | Google Generative AI (`gemini-1.5-flash`) | Contextual document Q&A, chat assistant, and structured JSON generation |
| **File Parsing** | `pdf-parse`, `mammoth`, Multer | Multipart file uploads and server-side text extraction (PDF / DOCX) |
| **Auth & Security** | JWT (`jsonwebtoken`), `bcrypt`, Helmet, Express Rate Limit | Access/refresh token lifecycle, password hashing, security headers, and rate limiting |
| **Payments** | Razorpay Node SDK, Node `crypto` | Order creation and cryptographic HMAC SHA-256 payment signature verification |
| **Deployment** | Vercel (Frontend), Render (Backend) | Cloud hosting with automated continuous deployment pipelines |

---

## 🏗 Architecture

```text
┌────────────────────────┐         HTTPS / REST API          ┌─────────────────────────────────────────┐
│   React 19 Frontend    │ ────────────────────────────────► │          Express.js Backend             │
│ (Vite + TS + Zustand)  │                                   │ (Helmet, RateLimit, Zod, In-Memory Cache)│
└────────────────────────┘                                   └────────────────────┬────────────────────┘
                                                                                  │
                                      ┌───────────────────────────────────────────┼────────────────────────────────┐
                                      ▼                                           ▼                                ▼
                           ┌────────────────────┐                      ┌────────────────────┐           ┌────────────────────┐
                           │     Prisma ORM     │                      │  Google Gemini AI  │           │ Cloud Integrations │
                           │ (PostgreSQL / Neon)│                      │ (gemini-1.5-flash) │           │(Razorpay,Cloudinary)│
                           └────────────────────┘                      └────────────────────┘           └────────────────────┘
```

---

## 🔁 Application Flow

1. **Authentication**: User registers or logs in with credentials (or Google OAuth); the backend verifies passwords via `bcrypt` and issues a short-lived access token (15m) and a persistent refresh token (7d).
2. **Dashboard & Metrics**: The client queries `/api/workspace/dashboard-stats` (cached with a 15-second TTL) to load user credit balance, quick actions, and recent activity logs.
3. **Document Ingestion**: User uploads a PDF or DOCX file; the backend parses raw text via `pdf-parse` or `mammoth` and stores the text content in PostgreSQL.
4. **AI Generation & Execution**: User triggers an AI tool (e.g., ATS analysis, mock interview, career roadmap) or asks a question about an uploaded document.
5. **Atomic Credit Accounting**: The backend checks user credits and executes an atomic Prisma transaction (`prisma.$transaction`) to deduct credits and record an audit log.
6. **Task Organization**: User organizes study roadmaps or project milestones directly into Kanban task boards with status and priority tags.
7. **Credit Top-Up & Billing**: User selects a credit bundle, completes payment through Razorpay checkout, and the backend verifies the HMAC SHA-256 signature before granting credits.

---

## 📂 Project Structure

```text
Ai-Saas/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # PostgreSQL schema (User, RefreshToken, Project, Task, Document, Payment)
│   ├── src/
│   │   ├── config/               # Database connection pool (db.ts) and demo data seeder (seed.ts)
│   │   ├── controllers/          # Business logic (auth, ai, document, workspace, billing, admin)
│   │   ├── middleware/           # JWT auth with 30s cache, Multer file upload, Zod validator
│   │   ├── routes/               # REST route declarations (auth, ai, document, workspace, billing, admin)
│   │   ├── services/             # Gemini AI client, document text parser, nodemailer service
│   │   ├── utils/                # Zod request validation schemas
│   │   └── server.ts             # Express setup, Gzip compression, rate limiting, and error handling
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/           # UI components (Layout, Header, Sidebar, Skeletons, GoogleAuthModal)
│   │   ├── pages/                # Route pages (Dashboard, AIChat, AITools, StudyPlanner, TaskManager, Admin)
│   │   │   └── auth/             # Auth pages (Login, Register, ForgotPassword, ResetPassword)
│   │   ├── store/                # Zustand stores (authStore, workspaceStore)
│   │   ├── App.tsx               # React Router configuration with lazy-loaded route components
│   │   └── main.tsx              # React DOM application root
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
├── render.yaml                   # Backend Render deployment configuration
├── .env.example                  # Environment variable template
└── README.md
```

---

## 🗄 Database Schema Design

The PostgreSQL database is managed through **Prisma ORM** with relational integrity, cascading deletions, and composite indexing:

| Model | Key Fields | Purpose |
| :--- | :--- | :--- |
| **`User`** | `id`, `email`, `role`, `credits`, `isVerified` | User account authentication, permissions, and live AI credit balance |
| **`RefreshToken`** | `token`, `userId`, `expiresAt` | Secure session management and single-device token revocation |
| **`Project` & `Task`** | `title`, `status`, `priority`, `dueDate` | Relational Kanban tasks linked to multi-user project workspaces |
| **`Document`** | `name`, `url`, `fileType`, `textContent` | Direct text storage for fast LLM prompt injection without repeated disk I/O |
| **`Payment`** | `amount`, `status`, `razorpayOrderId`, `razorpayPaymentId` | Transaction history with Razorpay audit references |
| **`AIRequestLog`** | `toolUsed`, `creditsUsed`, `status`, `createdAt` | Telemetry logs for usage auditing and admin analytics |
| **`Notification`** | `title`, `message`, `read`, `createdAt` | User-facing notification alerts |

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local instance or cloud database URL (e.g., Neon Cloud)

### 1. Clone the Repository & Configure Environment

```bash
git clone https://github.com/Sparsh88/Ai-Saas.git
cd Ai-Saas
cp .env.example backend/.env
```

Configure the environment variables in `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
JWT_ACCESS_SECRET="your_jwt_access_secret_key"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_key"
GEMINI_API_KEY="your_google_gemini_api_key"        # Optional: mock simulation mode if omitted
RAZORPAY_KEY_ID=""                                 # Optional: sandbox mode if omitted
RAZORPAY_KEY_SECRET=""
CLIENT_URL="http://localhost:5173"
```

### 2. Backend Setup & Database Migration

```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed    # Optional: seeds demo user and admin accounts
npm run dev            # Starts API server on http://localhost:5000
```

> **Default Seed Accounts**:
> - **Admin**: `admin@skillforge.ai` / `admin123` (Role: `ADMIN`, 9,999 Credits)
> - **User**: `user@skillforge.ai` / `user123` (Role: `USER`, 50 Credits)

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev            # Starts Vite dev server on http://localhost:5173
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register account (grants 10 initial credits) | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT tokens | No |
| `POST` | `/api/auth/google-login` | Authenticate via Google OAuth payload | No |
| `POST` | `/api/ai/chat` | Conversational AI assistant with chat history | Yes |
| `POST` | `/api/ai/chat-document` | Context-grounded Q&A against parsed document text | Yes |
| `POST` | `/api/ai/tool` | Execute AI tools (resume analysis, roadmaps, code) | Yes |
| `POST` | `/api/documents/upload` | Multipart file upload (PDF/DOCX/TXT) & text extraction | Yes |
| `GET` | `/api/workspace/dashboard-stats` | Fetch aggregated metrics and credit balance (cached) | Yes |
| `GET/POST` | `/api/workspace/projects` | CRUD operations for workspace projects & tasks | Yes |
| `POST` | `/api/billing/order` | Create Razorpay order (or mock sandbox order) | Yes |
| `POST` | `/api/billing/verify` | Verify HMAC SHA-256 signature and credit balance | Yes |
| `GET` | `/api/admin/stats` | System telemetry, user lists, and credit controls | Yes (Admin) |

---

## 🔑 Key Technical Highlights

1. **Atomic Transactions (`prisma.$transaction`)**: Ensures user credit deductions and telemetry audit logs are committed atomically, preventing race conditions or credit leaks during AI tool executions.
2. **Multi-Tier In-Memory Caching**: Express middleware caches user authentication tokens (30s TTL) and dashboard metrics (15s TTL) to reduce redundant PostgreSQL queries during active sessions.
3. **Cryptographic Payment Verification**: Validates incoming Razorpay signatures using Node `crypto.createHmac('sha256', secret)` against `order_id|payment_id` prior to provisioning credits.
4. **Resilient AI Mock Fallback**: If an API key is absent or upstream rate limits occur, the backend seamlessly switches to a structured mock generator to maintain full frontend functionality.

---

## 👨‍💻 Author

**Sparsh Chauhan**  
*Computer Science & Engineering Student | Full Stack Developer*

- **Portfolio**: [portfolio-flame-rho-29.vercel.app](https://portfolio-flame-rho-29.vercel.app/)
- **GitHub**: [@Sparsh88](https://github.com/Sparsh88)
- **LinkedIn**: [linkedin.com/in/sparshchauhan08](https://linkedin.com/in/sparshchauhan08)
- **Email**: [sparshchauhan050@gmail.com](mailto:sparshchauhan050@gmail.com)
