# 🚀 SkillForge AI

> **An AI-powered SaaS platform that helps students, job seekers, and professionals boost productivity, prepare for careers, and manage projects with intelligent AI tools.**

SkillForge AI is a modern **full-stack AI SaaS platform** built using **React, TypeScript, Node.js, Express, Prisma, PostgreSQL, and Google Gemini AI**. It combines career development tools, AI-powered assistance, project management, document intelligence, and analytics into one seamless workspace.

This project demonstrates production-ready full-stack development with secure authentication, scalable architecture, REST APIs, cloud storage, payment integration, and AI-powered features.

---

## 🌐 Live Demo

| Service | URL |
|----------|----------|
| **Frontend** | https://ai-saas-blond-zeta.vercel.app
| **Backend** | https://skillforge-ai-api.onrender.com

## 🌟 Features

### 🤖 AI Workspace
- AI Chat Assistant powered by Google Gemini
- AI-powered Resume ATS Score Analyzer
- Cover Letter Generator
- LinkedIn Profile Optimizer
- Professional Email Generator & Rewriter
- Personalized Learning Roadmaps
- Weekly Study Planner

### 🎯 AI Mock Interview
- HR & Technical Interview Simulation
- Speech-to-Text Support
- Confidence Score Analysis
- Filler Word Detection
- Speaking Pace Analysis
- AI-generated Interview Feedback

### 📁 Documents Hub
- Upload PDF & DOC Files
- AI Document Question Answering
- Automatic Text Extraction
- Cloudinary File Storage

### 📋 Productivity Workspace
- Kanban Task Management
- Project Workspace
- Calendar Planner
- Weekly Goals & Milestones
- Progress Tracking

### 📊 Dashboard & Analytics
- Productivity Analytics
- Task Statistics
- AI Usage Metrics
- Career Progress Dashboard

### 💳 Subscription System
- Razorpay Payment Integration
- Credit-based AI Usage
- Transaction History

### 🔐 Authentication & Security
- Secure JWT Authentication
- Refresh Tokens
- Email Verification
- Password Reset
- Role-based Authorization (User/Admin)
- Rate Limiting
- Helmet Security
- Zod Validation

### 👨‍💼 Admin Dashboard
- User Management
- Revenue Analytics
- Platform Statistics
- Credit Management
- Request Monitoring

---

# 🛠 Tech Stack

## Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Zustand
- React Router
- Axios
- Recharts

## Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- Bcrypt
- Multer
- Cloudinary

## AI & Third-Party Services
- Google Gemini API
- Razorpay
- Cloudinary

---

# 🏗 Architecture

```
React (Vite)
      │
Axios + JWT
      │
Express REST API
      │
──────────────────────────────
│ Controllers
│ Services
│ Middleware
│ Validation (Zod)
──────────────────────────────
      │
Prisma ORM
      │
PostgreSQL (Neon)

External Services
├── Google Gemini AI
├── Cloudinary
└── Razorpay
```

---

# 📂 Project Structure

```text
SkillForge-AI
│
├── backend
│   ├── prisma
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── server.ts
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── layouts
│   │   ├── pages
│   │   ├── services
│   │   ├── store
│   │   ├── utils
│   │   └── App.tsx
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js v18+
- PostgreSQL (Local or Neon)
- Google Gemini API Key (Optional)
- Razorpay Account (Optional)
- Cloudinary Account (Optional)

---

## Clone Repository

```bash
git clone https://github.com/yourusername/skillforge-ai.git

cd skillforge-ai
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file

```env
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRY=15m

JWT_REFRESH_EXPIRY=7d

GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=
```

Run Prisma

```bash
npx prisma db push
```

(Optional)

```bash
npm run prisma:seed
```

Start Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Open

```
http://localhost:5173
```

---

# 📡 API Modules

| Module | Description |
|----------|-------------|
| Authentication | Register, Login, JWT Authentication |
| AI Hub | Chat, Resume Analyzer, Cover Letter Generator |
| Documents | Upload & AI Query |
| Workspace | Tasks, Projects & Dashboard |
| Billing | Razorpay Integration |
| Admin | User & Analytics Management |

---

# 🔒 Security Features

- JWT Authentication
- Refresh Token Rotation
- Password Hashing (bcrypt)
- Role-Based Authorization
- Protected Routes
- Helmet Security
- Zod Validation
- API Rate Limiting
- Secure Environment Variables

---

# 🌍 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |
| AI | Google Gemini |
| Storage | Cloudinary |
| Payments | Razorpay |

---

# 🚀 Future Improvements

- AI Voice Interview Coach
- Team Collaboration Workspace
- Resume Version History
- AI Coding Assistant
- Mobile Application
- Offline Support (IndexedDB)
- Monthly AI Career Reports

---

# 📚 Learning Outcomes

This project helped me gain hands-on experience with:

- Full Stack Web Development
- REST API Development
- Authentication & Authorization
- Prisma ORM
- PostgreSQL Database Design
- AI Integration with Google Gemini
- Cloud Storage Integration
- Payment Gateway Integration
- State Management using Zustand
- Production-ready Project Architecture
- Secure Backend Development

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Sparsh Chauhan**

**Full Stack Developer | AI Enthusiast | Computer Science Student**

- 🌐 Portfolio: https://your-portfolio.com
- 💼 LinkedIn: https://linkedin.com/in/your-profile
- 📧 Email: your@email.com

---

## ⭐ Support

If you found this project helpful, please consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future improvements.

---