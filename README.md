# SkillForge AI — Next-Gen AI Career & Productivity SaaS

An intelligent, full-stack AI SaaS workspace combining multi-model AI career development, document intelligence, interactive chat, and Kanban project management into a single, high-performance platform.

---

## 🌐 Live Demo & Repository

- **Live Application:** [https://ai-saas-blond-zeta.vercel.app](https://ai-saas-blond-zeta.vercel.app)
- **Backend API:** [https://skillforge-ai-api.onrender.com](https://skillforge-ai-api.onrender.com)
- **API Health Check:** [https://skillforge-ai-api.onrender.com/health](https://skillforge-ai-api.onrender.com/health)
- **GitHub Repository:** [https://github.com/Sparsh88/Ai-Saas](https://github.com/Sparsh88/Ai-Saas)

---

## ⚡ Overview

**SkillForge AI** is engineered to eliminate fragmented workflows by consolidating career preparation, document intelligence, and developer productivity tools into a unified, high-speed interface. 

Built on a modern stack featuring **React 19**, **TypeScript**, **Node.js/Express**, **Prisma ORM**, **PostgreSQL (Neon Cloud)**, and **Google Gemini 1.5 Flash**, the platform provides instant, unrestricted access for all users without subscription tiers, credit meters, or complex admin panels.

### 🎨 Design & Visual Aesthetic
- **Obsidian Dark Mode:** Custom pure jet-black foundation (`#000000`) with sleek panel containers (`#0d0d0d`) and crisp dark borders (`#1c1c1c` / `#222222`).
- **Curated Accent Palette:**
  - **Sidebar & Navbar:** Vibrant Purple branding (`#a855f7`) with smooth glowing navigation capsules and profile indicators.
  - **Dashboard & Workspaces:** Harmonious 4-color hierarchy — **Blue (`#3b82f6`)**, **Purple (`#a855f7`)**, **Red (`#ef4444`)**, and **Yellow (`#eab308`)** across metrics, Kanban workflows, and telemetry graphs.
  - **Micro-Interactions:** Hardware-accelerated Framer Motion animations with Spring physics.

---

## ✨ Key Features & Modules

### 1. 🤖 AI Document Intelligence & Context Q&A
- Upload multi-format documents (**PDF, DOCX, TXT**) with in-memory parsing via `pdf-parse` and `mammoth`.
- Grounded contextual chat querying uploaded files directly through **Google Gemini 1.5 Flash**.
- Color-coded document format badges (PDF in Red, DOCX in Blue, TXT in Yellow, Markdown in Purple).

### 2. 📄 ATS Resume Scorer & Analyzer
- Upload or paste resume content for instant parsing against modern applicant tracking system algorithms.
- Produces an ATS score (0–100), detected skills, missing keywords, bullet point formatting tips, and action-verb improvements.

### 3. 🎯 AI Mock Interviewer & Speech Diagnostics
- Role-specific mock interview simulations tailored to any industry or software engineering level.
- Comprehensive evaluation including technical accuracy score, candidate feedback, and speech pacing metrics.

### 4. 🗺️ AI Career Roadmaps & Study Curricula
- **Career Roadmaps:** Multi-phase technical learning milestones, required tools, and practical project challenges.
- **Curriculum Planner:** Structured weekly study schedules with day-by-day task allocations.
- **Interview Prep:** Dynamic question generation with targeted keyword analysis.

### 5. 🛠️ 25+ AI Writing & Developer Tools
- Built-in utilities for **SQL Query Generation**, **Regex Construction**, **Code Explanation**, **Bug Fixing**, **Cover Letter Writing**, **Blog Drafting**, and **Cold Email Generation**.
- One-click copy and file download directly from the AI output terminal.

### 6. 📋 Kanban & Calendar Project Management
- Interactive Kanban workspace with `To Do`, `In Progress`, and `Done` swimlanes.
- Priority indicators (`HIGH`, `MEDIUM`, `LOW`), custom deadlines, and real-time status transitions.
- Calendar view toggle for visual deadline tracking.

### 7. 🚀 Instant & Direct Access
- Streamlined email/password registration with JWT authentication.
- All AI utilities and workspace tools unlocked out of the box with zero paywalls.

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 | Ultra-fast single page client with typed component architecture |
| **Animation & Icons** | Framer Motion, Lucide React | Hardware-accelerated transitions and sleek vector iconography |
| **State Management** | Zustand | Persistent lightweight client stores for auth and workspace state |
| **Backend API** | Node.js, Express.js, TypeScript | High-throughput REST API with Gzip compression and rate limiting |
| **Database & ORM** | PostgreSQL (Neon Cloud), Prisma ORM | Relational data schema with migrations, indexing, and connection pooling |
| **AI Engine** | Google Gemini 1.5 Flash API | Document analysis, chat grounding, and natural language generation |
| **Document Parsers** | pdf-parse, mammoth, multer | In-memory text extraction from uploaded PDF and DOCX files |
| **Hosting & Cloud** | Vercel (Frontend), Render (Backend) | Edge CDN frontend distribution and containerized backend deployment |

---

## 📐 System Architecture

```text
Client Browser (React 19 + TypeScript + Zustand + Tailwind v4)
       │
       │ HTTPS / REST API
       ▼
Express.js API Server (Node.js + TypeScript)
  ├── Security & Performance (Helmet, CORS, Native Gzip, X-Response-Time)
  ├── Auth Middleware (JWT Verification & Short-lived Tokens)
  ├── Controllers (Auth, AI Tools, Documents, Workspace & Kanban)
  └── Services
       ├── Google Gemini 1.5 Flash (LLM Generation with Fallback Handlers)
       ├── Document Parser Engine (pdf-parse / mammoth)
       └── Prisma ORM Client (Connection Pooling & Atomic Transactions)
               │
               ▼
       PostgreSQL Database (Neon Cloud / Local Instance)
```

---

## 📁 Project Structure

```text
Ai-Saas/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma data schema (User, Project, Task, Document, Telemetry)
│   ├── src/
│   │   ├── config/               # Database pool and connection configuration
│   │   ├── controllers/          # Business logic (auth, ai, document, workspace)
│   │   ├── middleware/           # JWT auth, Multer file upload, Zod validator
│   │   ├── routes/               # API route handlers (/api/auth, /api/ai, /api/documents, /api/workspace)
│   │   ├── services/             # Gemini 1.5 Flash service, document parser, email service
│   │   ├── utils/                # Zod schemas and validation helpers
│   │   └── server.ts             # Express server configuration, middleware, and health check
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Sidebar, Header, Layout, PageSkeleton, Footer
│   │   ├── pages/                # Views (Dashboard, AIChat, AITools, StudyPlanner, TaskManager, Documents)
│   │   │   └── auth/             # Authentication views (Login, Register, ForgotPassword, ResetPassword)
│   │   ├── store/                # Zustand stores (authStore, workspaceStore)
│   │   ├── App.tsx               # Route declarations and suspense boundaries
│   │   ├── index.css             # Tailwind v4 theme variables and obsidian dark mode rules
│   │   └── main.tsx              # React root mount
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
├── render.yaml                   # Backend Render deployment configuration
└── .env.example                  # Environment configuration template
```

---

## 🚀 Installation & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Cloud instance (e.g. Neon, Supabase) or local database

---

### 1. Clone the Repository

```bash
git clone https://github.com/Sparsh88/Ai-Saas.git
cd Ai-Saas
```

---

### 2. Configure Backend Environment

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp ../.env.example .env
```

Populate the required environment variables:

```env
PORT=5000
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
JWT_ACCESS_SECRET="your_jwt_access_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"

GEMINI_API_KEY="your_google_gemini_api_key"
```

---

### 3. Initialize Database & Run Backend

```bash
# Inside backend directory
npm install
npx prisma db push
npm run dev
```

Backend will be active at `http://localhost:5000`. Verify with `http://localhost:5000/health`.

---

### 4. Run Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Frontend application will open at `http://localhost:5173`.

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel)
1. Import the GitHub repository into **Vercel**.
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Set Build Command: `npm run build` and Output Directory: `dist`.
5. Deploy!

### Backend Deployment (Render)
1. Create a new **Web Service** on **Render** linked to the GitHub repository.
2. Root Directory: `backend`.
3. Build Command: `npm install && npm run build`.
4. Start Command: `npm start`.
5. Add Environment Variables (`DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `GEMINI_API_KEY`, `CLIENT_URL`).
6. Deploy!

---

## 👨‍💻 Author

**Sparsh Chauhan**  
*Full Stack Developer & AI SaaS Engineer*

- **Portfolio:** [https://portfolio-delta-topaz-jsfd5oekgj.vercel.app/](https://portfolio-delta-topaz-jsfd5oekgj.vercel.app/)
- **GitHub:** [@Sparsh88](https://github.com/Sparsh88)
- **LinkedIn:** [linkedin.com/in/sparsh88](https://www.linkedin.com/in/sparsh88)
- **Email:** [sparshchauhan050@gmail.com](mailto:sparshchauhan050@gmail.com)

---
