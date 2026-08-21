# SkillForge AI — Intelligent Career & Productivity SaaS

An intelligent full-stack SaaS platform combining AI-powered career development tools, document intelligence, and Kanban project management into a unified, high-performance workspace.

---

## Live Demo & Repository

- **Live Application:** [https://ai-saas-blond-zeta.vercel.app](https://ai-saas-blond-zeta.vercel.app)
- **Backend API:** [https://skillforge-ai-api.onrender.com](https://skillforge-ai-api.onrender.com)
- **API Health Check:** [https://skillforge-ai-api.onrender.com/health](https://skillforge-ai-api.onrender.com/health)
- **GitHub Repository:** [https://github.com/Sparsh88/Ai-Saas](https://github.com/Sparsh88/Ai-Saas)

---

## Overview

SkillForge AI is a full-stack SaaS web application engineered to consolidate fragmented career preparation, document analysis, and developer productivity utilities into a single platform. Built with React 19, TypeScript, Node.js/Express, Prisma ORM, PostgreSQL (Neon), and Google Gemini 1.5 Flash, the platform delivers context-aware AI utilities alongside project management with instant, unrestricted access for all registered users.

The application addresses productivity loss caused by context switching across disconnected tools. By uniting document-grounded question answering, ATS resume scoring, voice-enabled mock interviews, career roadmap planning, and task tracking under one interface, SkillForge AI offers a streamlined workflow for students, job seekers, and developers.

---

## Key Features

- **AI Document Assistant & Context Q&A:** Upload multi-format documents (PDF, DOCX, TXT) and query their contents directly using Gemini 1.5 Flash context injection without manual searching.
- **ATS Resume Scorer & Breakdown:** Analyzes resume content against industry benchmarks, producing an ATS score (0–100), detected keywords, missing keywords, and targeted formatting feedback.
- **AI Mock Interview & Speech Analysis:** Simulates role-specific technical and behavioral interviews with Web Speech API voice capture, filler word tracking, speaking pace (WPM), and model answer comparisons.
- **Career Roadmaps & Study Curricula:** Generates multi-phase technical learning milestones, structured weekly study timetables, interactive mind map nodes, and flashcard decks.
- **Developer & Writing Utilities:** Built-in tools for SQL generation, regex creation, code explanation, bug fixing, cover letter drafting, and professional email generation.
- **Kanban Task & Project Management:** Multi-project task boards supporting `TODO`, `IN_PROGRESS`, and `DONE` states with priority tags (`LOW`, `MEDIUM`, `HIGH`) and real-time status updates.
- **Direct & Instant Access:** Seamless login and account creation with immediate access to all AI models and productivity tools.

---

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Frontend Framework | React 19, TypeScript, Vite | Modern single-page client with typed component architecture |
| Styling & UI | Tailwind CSS, Lucide React | Responsive dark/light theme and accessible iconography |
| State Management | Zustand | Lightweight client stores for authentication and workspace state |
| Backend Runtime | Node.js, Express.js | REST API routing, rate limiting, compression, and business logic |
| Database & ORM | PostgreSQL (Neon Cloud), Prisma ORM | Relational schema with migrations and foreign keys |
| AI Integration | Google Gemini 1.5 Flash | Document Q&A, mock interview evaluation, and career planning |
| Document Parsers | pdf-parse, mammoth | In-memory text extraction from uploaded PDF and DOCX documents |
| Deployment | Vercel (Frontend), Render (Backend) | Global edge hosting and containerized API hosting |

---

## Architecture

```text
Client Browser (React 19 + TypeScript + Zustand)
       │
       │ HTTPS / REST API
       ▼
Express.js API Server (Node.js + TypeScript)
  ├── Auth Middleware (JWT Token Verification & 30s In-Memory Cache)
  ├── Rate Limiter & Gzip Compression
  ├── Controllers (Auth, AI Tools, Documents, Projects, Billing, Admin)
  └── Services
       ├── Gemini 1.5 Flash API (LLM Generation with Fallback Handler)
       ├── Document Parser Engine (pdf-parse / mammoth)
       ├── Razorpay Payment SDK (HMAC SHA-256 Signature Verification)
       └── Prisma ORM Client (Connection Pooling & Atomic Transactions)
               │
               ▼
       PostgreSQL Database (Neon Cloud)
```

---

## Application Flow

1. **User Authentication:** User registers or logs in; backend issues a short-lived JWT access token and refresh token, granting initial free credits.
2. **Workspace Setup:** User creates projects and organizes tasks on the Kanban board with priorities and deadlines.
3. **Document Ingestion:** User uploads a PDF or DOCX file; backend extracts plain text and stores it in PostgreSQL for prompt context injection.
4. **AI Generation & Execution:** User triggers an AI tool (ATS analysis, mock interview, career roadmap) or queries an uploaded document.
5. **Atomic Credit Accounting:** Backend verifies credit balance and executes a `prisma.$transaction` to atomically deduct credits and log execution telemetry.
6. **Billing & Credit Top-Up:** User selects a credit bundle, completes checkout via Razorpay, and the backend verifies cryptographic HMAC SHA-256 signatures before provisioning credits.

---

## Project Structure

```text
Ai-Saas/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma schema (User, Project, Task, Document, Payment)
│   ├── src/
│   │   ├── config/               # Database pool and seeders
│   │   ├── controllers/          # Business logic (auth, ai, document, workspace, billing, admin)
│   │   ├── middleware/           # JWT auth cache, Multer upload, Zod validator
│   │   ├── routes/               # REST route declarations
│   │   ├── services/             # Gemini AI service, document parser, email service
│   │   ├── utils/                # Validation schemas and helper utilities
│   │   └── server.ts             # Express server setup and error handlers
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components, header, sidebar, modals
│   │   ├── pages/                # Route views (Dashboard, AIChat, AITools, StudyPlanner, Tasks, Admin)
│   │   │   └── auth/             # Auth pages (Login, Register, ForgotPassword)
│   │   ├── store/                # Zustand stores (authStore, workspaceStore)
│   │   ├── App.tsx               # React Router configuration
│   │   └── main.tsx              # DOM mounting
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
├── render.yaml
└── .env.example
```

---

## Installation & Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: Cloud database URL (e.g. Neon) or local instance

### 1. Clone the Repository & Configure Environment

```bash
git clone https://github.com/Sparsh88/Ai-Saas.git
cd Ai-Saas
```

Create `backend/.env`:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
JWT_ACCESS_SECRET="your_jwt_access_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
GEMINI_API_KEY="your_google_gemini_api_key"
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
CLIENT_URL="http://localhost:5173"
```

### 2. Backend Setup & Database Push

```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## Author

**Sparsh Chauhan**  
*Computer Science & Engineering Student | Full Stack Developer*

- **Portfolio:** [portfolio-delta-topaz-jsfd5oekgj.vercel.app](https://portfolio-delta-topaz-jsfd5oekgj.vercel.app/)
- **GitHub:** [@Sparsh88](https://github.com/Sparsh88)
- **LinkedIn:** [linkedin.com/in/sparshchauhan08](https://linkedin.com/in/sparshchauhan08)
- **Email:** [sparshchauhan050@gmail.com](mailto:sparshchauhan050@gmail.com)
