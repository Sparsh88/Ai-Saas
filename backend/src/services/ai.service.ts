import { GoogleGenerativeAI } from '@google/generative-ai';

function getGeminiClient(): GoogleGenerativeAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (key && key.trim()) {
    return new GoogleGenerativeAI(key.trim());
  }
  return null;
}

// Helper to run prompt or fallback to mock
async function generateAIResponse(prompt: string, systemInstruction?: string): Promise<string> {
  const client = getGeminiClient();
  if (client) {
    const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];
    const fullPrompt = systemInstruction ? `${systemInstruction}\n\nTask:\n${prompt}` : prompt;

    for (const modelName of modelsToTry) {
      try {
        const model = client.getGenerativeModel({ 
          model: modelName,
          ...(systemInstruction ? { systemInstruction } : {})
        });
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        let text = response.text();
        if (text.startsWith('```json')) {
          text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (text.startsWith('```') && systemInstruction?.includes('JSON')) {
          text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        return text;
      } catch (error: any) {
        console.warn(`Gemini model ${modelName} error, trying alternative model:`, error?.message || error);
      }
    }
  }
  // If no API client or failure, generate mock response based on prompt analysis
  return generateMockData(prompt);
}

// A comprehensive mock generator for all the AI SaaS features
function generateMockData(prompt: string): string {
  const lowercasePrompt = prompt.toLowerCase();

  // 1. Resume ATS Score / Analyzer
  if (lowercasePrompt.includes('ats') || lowercasePrompt.includes('resume') && (lowercasePrompt.includes('analyze') || lowercasePrompt.includes('score'))) {
    return JSON.stringify({
      score: 78,
      keywordsFound: ['TypeScript', 'Node.js', 'React', 'REST APIs', 'Agile', 'Git'],
      missingKeywords: ['CI/CD', 'AWS', 'Docker', 'GraphQL', 'System Design'],
      formattingFeedback: 'The margins and typography look excellent. However, make sure to detail specific metric achievements rather than listing responsibilities (e.g. "Improved query performance by 40%").',
      contentFeedback: 'Your professional experience section is strong. Recommend adding a dedicated skills matrix at the top for automated screeners to pick up.'
    }, null, 2);
  }

  // 2. Career Roadmap
  if (lowercasePrompt.includes('roadmap') || lowercasePrompt.includes('career path')) {
    const roleMatch = prompt.match(/become a:\s*"([^"]+)"/i) || prompt.match(/role:\s*"([^"]+)"/i);
    const requestedRole = roleMatch ? roleMatch[1].trim() : 'AI & Full Stack Engineer';
    const lowerRole = requestedRole.toLowerCase();

    // AI & Machine Learning Path
    if (lowerRole.includes('ai') || lowerRole.includes('ml') || lowerRole.includes('machine learning') || lowerRole.includes('data science') || lowerRole.includes('deep learning')) {
      return JSON.stringify({
        role: requestedRole,
        description: `Comprehensive AI & Machine Learning career roadmap covering Python foundations, mathematical modeling, neural networks, PyTorch/TensorFlow, and production LLM engineering.`,
        milestones: [
          {
            phase: 'Phase 1: Mathematics & Python Foundations',
            duration: '4-6 Weeks',
            topics: ['Linear Algebra & Matrix Calculus', 'NumPy & Pandas data pipelines', 'Probability & Inferential Statistics', 'Data Visualization (Matplotlib, Seaborn)'],
            projects: ['Build an exploratory data analysis dashboard on real-world Kaggle datasets']
          },
          {
            phase: 'Phase 2: Core Machine Learning Algorithms',
            duration: '6-8 Weeks',
            topics: ['Supervised Learning (Regression, Random Forest, XGBoost)', 'Unsupervised Learning (K-Means, PCA, Clustering)', 'Scikit-Learn pipeline optimization', 'Model validation & cross-entropy metrics'],
            projects: ['Build a predictive housing price regression & customer churn classification model']
          },
          {
            phase: 'Phase 3: Deep Learning & Neural Architectures',
            duration: '8-10 Weeks',
            topics: ['Neural networks from scratch with backprop', 'PyTorch / TensorFlow deep learning workflows', 'Convolutional Networks (CNNs) & Computer Vision', 'Transformers & Self-Attention mechanisms'],
            projects: ['Train an image classifier and a real-time sentiment analysis Transformer from scratch']
          },
          {
            phase: 'Phase 4: LLMs, RAG & MLOps Deployment',
            duration: '6-8 Weeks',
            topics: ['LangChain / LlamaIndex workflows', 'Vector Databases (Pinecone, ChromaDB)', 'Fine-tuning & LoRA quantization', 'Docker containerized FastAPI model serving'],
            projects: ['Deploy an enterprise Document RAG Assistant with Gemini 1.5 and FastAPI on cloud']
          }
        ]
      }, null, 2);
    }

    // Cloud & DevOps Path
    if (lowerRole.includes('devops') || lowerRole.includes('cloud') || lowerRole.includes('aws') || lowerRole.includes('kubernetes')) {
      return JSON.stringify({
        role: requestedRole,
        description: `Cloud & DevOps Engineering roadmap covering infrastructure as code, container orchestration, CI/CD pipelines, and cloud security.`,
        milestones: [
          {
            phase: 'Phase 1: Linux & Networking Foundations',
            duration: '4 Weeks',
            topics: ['Linux system administration', 'Bash scripting & automation', 'TCP/IP, DNS, SSL/TLS', 'Git advanced branch workflows'],
            projects: ['Automate multi-server provisioning and backup via Bash scripts']
          },
          {
            phase: 'Phase 2: Containers & Orchestration',
            duration: '6 Weeks',
            topics: ['Docker multi-stage builds', 'Docker Compose setups', 'Kubernetes clusters & pods', 'Helm chart package management'],
            projects: ['Containerize a microservices SaaS and orchestrate with Kubernetes']
          },
          {
            phase: 'Phase 3: Infrastructure as Code & CI/CD',
            duration: '6-8 Weeks',
            topics: ['Terraform provider modules', 'GitHub Actions / GitLab CI pipelines', 'Ansible configuration management', 'Zero-downtime blue/green deployments'],
            projects: ['Provision AWS VPC, EKS cluster, and RDS database completely through Terraform']
          },
          {
            phase: 'Phase 4: Observability & DevSecOps',
            duration: '4-6 Weeks',
            topics: ['Prometheus & Grafana monitoring', 'ELK / Loki centralized logging', 'Vulnerability scanning with Trivy', 'Secrets management via Vault'],
            projects: ['Build a production telemetry dashboard with automated alerting triggers']
          }
        ]
      }, null, 2);
    }

    // Dynamic Generic Role Roadmap
    return JSON.stringify({
      role: requestedRole,
      description: `Structured career roadmap for ${requestedRole}, taking you from foundational principles to advanced production-level mastery.`,
      milestones: [
        {
          phase: `Phase 1: ${requestedRole} Core Fundamentals`,
          duration: '4-6 Weeks',
          topics: ['Core syntax & fundamental paradigms', 'Essential toolchains & environments', 'Standard industry design patterns', 'Version control & collaboration'],
          projects: [`Develop a functional foundational starter project for ${requestedRole}`]
        },
        {
          phase: `Phase 2: Intermediate Architecture & Applied Workflows`,
          duration: '6-8 Weeks',
          topics: ['Data flow & state management', 'API integrations & networking', 'Testing & validation methodologies', 'Performance optimization'],
          projects: [`Construct a full-featured application demonstrating key ${requestedRole} workflows`]
        },
        {
          phase: `Phase 3: Advanced Systems & Scaling`,
          duration: '8-10 Weeks',
          topics: ['Production architecture design', 'Security & authorization best practices', 'Asynchronous processing & caching', 'Database indexing & query tuning'],
          projects: [`Build a scalable, resilient real-world system tailored for ${requestedRole}`]
        },
        {
          phase: `Phase 4: Cloud Deployment & Capstone Portfolio`,
          duration: '4 Weeks',
          topics: ['CI/CD pipeline automation', 'Cloud hosting & containerization', 'Monitoring & log aggregation', 'Portfolio polishing & interview prep'],
          projects: [`Deploy your capstone project live with custom domain, SSL, and automated CI/CD`]
        }
      ]
    }, null, 2);
  }

  // 3. Mock Interview Practice Questions
  if (lowercasePrompt.includes('interview') && lowercasePrompt.includes('question')) {
    const roleMatch = prompt.match(/for a "([^"]+)" position/i);
    const requestedRole = roleMatch ? roleMatch[1].trim() : 'Software Engineer';
    const lowerRole = requestedRole.toLowerCase();

    if (lowerRole.includes('ai') || lowerRole.includes('ml') || lowerRole.includes('machine learning') || lowerRole.includes('data')) {
      return JSON.stringify([
        {
          id: 'q1',
          type: 'TECHNICAL',
          question: 'Explain the bias-variance tradeoff in Machine Learning and how regularization techniques (L1/L2) mitigate overfitting.',
          optimalKeywords: ['Overfitting', 'Underfitting', 'L1 Lasso', 'L2 Ridge', 'Generalization Error']
        },
        {
          id: 'q2',
          type: 'BEHAVIORAL',
          question: 'Describe a project where your machine learning model performed poorly in production compared to validation. How did you diagnose and resolve data drift?',
          optimalKeywords: ['Concept Drift', 'Feature Store', 'Monitoring', 'Retraining Pipeline']
        },
        {
          id: 'q3',
          type: 'CODING',
          question: 'Implement a vectorized function to compute Cosine Similarity between a query embedding and a matrix of document embeddings in NumPy/Python.',
          optimalKeywords: ['Dot Product', 'Norms', 'Vectorization', 'O(N) Complexity']
        }
      ], null, 2);
    }

    return JSON.stringify([
      {
        id: 'q1',
        type: 'TECHNICAL',
        question: `Explain core architectural principles and state management patterns you would use when building scalable systems for a ${requestedRole}.`,
        optimalKeywords: ['System Design', 'Scalability', 'State Management', 'Asynchronous Flow']
      },
      {
        id: 'q2',
        type: 'BEHAVIORAL',
        question: 'Describe a situation where you had a disagreement with a team member regarding a technical decision. How did you reach a consensus?',
        optimalKeywords: ['STAR method', 'collaboration', 'tradeoffs', 'compromise']
      },
      {
        id: 'q3',
        type: 'CODING',
        question: 'Write a function that accepts an array of intervals and merges all overlapping intervals. Explain its time and space complexity.',
        optimalKeywords: ['sorting', 'greedy', 'O(N log N) time', 'O(N) space']
      }
    ], null, 2);
  }

  // 4. Mock Interview Answer Evaluation
  if (lowercasePrompt.includes('evaluate') || lowercasePrompt.includes('answer')) {
    return JSON.stringify({
      score: 85,
      feedback: 'Solid response with clear articulation of core principles. To score higher, make sure to detail specific metric achievements and trade-offs.',
      missingPoints: ['Mention of performance benchmarks', 'Time/space complexity analysis'],
      improvedAnswer: 'A comprehensive answer highlights both theoretical foundations and real-world trade-offs, citing specific design patterns and metrics.'
    }, null, 2);
  }

  // 5. Speech Analysis
  if (lowercasePrompt.includes('speech') || lowercasePrompt.includes('filler')) {
    return JSON.stringify({
      fillerWordsCount: { like: 4, um: 3, absolute: 1, basically: 2 },
      speakingRateWPM: 135,
      confidenceScore: 85,
      pacingFeedback: 'Your rate of speech is optimal (130-150 WPM). Good pause intervals.',
      improvementAreas: 'Try replacing "basically" with transition statements like "consequently" or pause silently instead of saying "um".'
    }, null, 2);
  }

  // 6. Mind Map Generator
  if (lowercasePrompt.includes('mind map') || lowercasePrompt.includes('mindmap')) {
    return JSON.stringify({
      topic: 'Software Architecture & Cloud Systems',
      nodes: [
        { id: '1', label: 'Architecture Systems', type: 'root' },
        { id: '2', label: 'Frontend Layer (React, State, UI/UX)', parentId: '1' },
        { id: '3', label: 'Backend Layer (Express, API Gateway, Auth)', parentId: '1' },
        { id: '4', label: 'Data & Database (PostgreSQL, Prisma, Cache)', parentId: '1' },
        { id: '5', label: 'Cloud & AI (Gemini, Docker, CI/CD)', parentId: '1' }
      ]
    }, null, 2);
  }

  // 7. Flashcards Generator
  if (lowercasePrompt.includes('flashcard') || lowercasePrompt.includes('cards')) {
    return JSON.stringify([
      { id: 1, front: 'What is the purpose of the virtual DOM in React?', back: 'It is a lightweight copy of the real DOM in memory. React uses it to track changes (diffing) and only updates the actual DOM where necessary, improving rendering performance.' },
      { id: 2, front: 'Explain closure in JavaScript.', back: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment), allowing the function to access variables from an outer scope even after it has executed.' },
      { id: 3, front: 'What is an index in databases?', back: 'An index is a database data structure (typically a B-Tree) that speeds up data retrieval operations on a table at the cost of additional writes and storage.' }
    ], null, 2);
  }

  // 8. Study Planner
  if (lowercasePrompt.includes('study plan') || lowercasePrompt.includes('calendar')) {
    const topicMatch = prompt.match(/learning:\s*"([^"]+)"/i);
    const requestedTopic = topicMatch ? topicMatch[1].trim() : 'Software Engineering';

    return JSON.stringify({
      title: `${requestedTopic} Mastery Curriculum`,
      weeklySchedule: [
        {
          week: 'Week 1',
          goal: `Understand Core Principles of ${requestedTopic}`,
          days: [
            { day: 'Monday', task: `Study fundamentals and architecture of ${requestedTopic}` },
            { day: 'Wednesday', task: 'Practice hands-on coding exercises and modules' },
            { day: 'Friday', task: 'Build a functional starter project' }
          ]
        },
        {
          week: 'Week 2',
          goal: `Advanced Implementation & Real-World Projects for ${requestedTopic}`,
          days: [
            { day: 'Monday', task: 'Deep dive into performance optimization and best practices' },
            { day: 'Wednesday', task: 'Implement error handling, security, and edge-cases' },
            { day: 'Friday', task: 'Deploy capstone application live to cloud' }
          ]
        }
      ]
    }, null, 2);
  }

  // 9. Task Generator from project scope
  if (lowercasePrompt.includes('task') && lowercasePrompt.includes('generator')) {
    return JSON.stringify([
      { title: 'Initialize database configurations', description: 'Setup schema migrations, connection pools, and ORM schemas.', status: 'TODO', priority: 'HIGH' },
      { title: 'Develop JWT router security keys', description: 'Create secrets and configure cookies/header extractions.', status: 'TODO', priority: 'HIGH' },
      { title: 'Integrate prompt layout helpers', description: 'Incorporate layout states and component templates.', status: 'TODO', priority: 'MEDIUM' }
    ], null, 2);
  }

  // 10. Code helper tools (Generate, Explain, Bug Fix, SQL, Regex)
  if (lowercasePrompt.includes('code') || lowercasePrompt.includes('bug') || lowercasePrompt.includes('sql') || lowercasePrompt.includes('regex')) {
    if (lowercasePrompt.includes('explain')) {
      return `### 💡 Code Explanation\n\nThis function executes a step-by-step operation with optimal efficiency:\n\n1. **Input Validation:** Confirms array boundaries and guards against null/empty edge cases.\n2. **State & Pointer Tracking:** Iterates through items maintaining an active state cursor.\n3. **Transformation:** Applies required transformations without mutating original memory references.\n4. **Complexity:** Executes in **O(N)** time and **O(1)** auxiliary space.`;
    }
    if (lowercasePrompt.includes('fix') || lowercasePrompt.includes('bug')) {
      return `### 🛠️ Bug Fix Analysis & Correction\n\n**Identified Issue:** Potential undefined index access and unhandled edge case on empty array inputs.\n\n**Corrected Code:**\n\`\`\`typescript\nexport function processDataSafe<T>(items: T[]): T[] {\n  if (!Array.isArray(items) || items.length === 0) {\n    return [];\n  }\n  return items.filter((item): item is NonNullable<T> => item != null);\n}\n\`\`\`\n\n**Benefits:** Guarantees type safety and prevents runtime null-pointer exceptions.`;
    }
    if (lowercasePrompt.includes('sql')) {
      return `### 🗄️ Production SQL Query\n\n\`\`\`sql\n-- Aggregated user metrics and revenue calculation\nSELECT \n    u.id AS user_id,\n    u.name AS user_name,\n    COUNT(p.id) AS total_orders,\n    COALESCE(SUM(p.amount), 0) AS total_spend\nFROM \n    "User" u\nLEFT JOIN \n    "Payment" p ON u.id = p.userId AND p.status = 'SUCCESS'\nGROUP BY \n    u.id, u.name\nORDER BY \n    total_spend DESC;\n\`\`\``;
    }
    if (lowercasePrompt.includes('regex')) {
      return `### 🔍 Regular Expression (Regex)\n\n\`\`\`regex\n^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\n\`\`\`\n\n**Pattern Breakdown:**\n- \`^[a-zA-Z0-9._%+-]+\`: Matches username prefix.\n- \`@\`: Requires standard literal '@' symbol.\n- \`[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\`: Matches domain name and minimum 2-letter TLD.`;
    }
    return `### 💻 Generated Code Block\n\n\`\`\`typescript\n/**\n * Debounce helper to limit execution frequency\n */\nexport function debounce<T extends (...args: any[]) => void>(\n  func: T, \n  waitMs: number = 300\n): (...args: Parameters<T>) => void {\n  let timeoutId: NodeJS.Timeout | null = null;\n  return (...args: Parameters<T>) => {\n    if (timeoutId) clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func(...args), waitMs);\n  };\n}\n\`\`\``;
  }

  // 11. Resume / Career Advice
  if (lowercasePrompt.includes('resume') || lowercasePrompt.includes('cv')) {
    return `### 📄 Resume Enhancement Strategy & Guidelines\n\nTo build a high-impact, ATS-optimized resume, follow these targeted recommendations:\n\n1. **Quantify Your Impact:** Use Google's formula: *Accomplished [X] as measured by [Y], by doing [Z]*. E.g., *"Engineered real-time notifications with Redis, cutting latency by 45% for 10k+ daily users."*\n2. **Structure for ATS Parsing:** Keep clean headings (*Experience*, *Projects*, *Skills*, *Education*). Avoid multi-column tables that confuse ATS parsers.\n3. **Tailor Core Keywords:** Align your technical skills section with the specific job description (e.g., React 19, TypeScript, PostgreSQL, Node.js).\n4. **Projects Spotlight:** Feature 2-3 full-stack applications with live URLs, GitHub repositories, and architectural descriptions.\n5. **ATS Scorer Tool:** Try our dedicated **ATS Resume Scorer** under AI Writing Tools to scan your resume text and get immediate feedback!`;
  }

  // 12. Email Writer
  if (lowercasePrompt.includes('email') || lowercasePrompt.includes('subject')) {
    const subjectMatch = prompt.match(/subject "([^"]+)"/i) || prompt.match(/subject:\s*([^\n]+)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : 'Leave Application / Formal Notice';
    return `Subject: ${subject}

Dear Manager / Team Lead,

I am writing to formally notify you that I am unwell and unable to attend work today due to medical illness. 

I have organized my active tasks and ensured any urgent items are covered. I will monitor my email periodically for any critical emergencies and will resume my regular responsibilities as soon as I recover.

Thank you for your understanding and consideration.

Best regards,
Sparsh Chauhan
Software Engineer`;
  }

  // 13. Cover Letter
  if (lowercasePrompt.includes('cover letter') || lowercasePrompt.includes('job description')) {
    return `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the Software Engineer position. With strong experience designing robust web applications, optimizing databases, and engineering modern user interfaces, I am eager to contribute to your engineering goals.

Throughout my development experience, I have built full-stack TypeScript platforms, architected resilient REST APIs with Express and PostgreSQL, and designed accessible, responsive UIs with React and Tailwind CSS. I prioritize clean code, automated testing, and performance optimization.

Thank you for your time and consideration. I welcome the opportunity to discuss how my skillset aligns with your team's objectives.

Sincerely,
Sparsh Chauhan`;
  }

  // 14. LinkedIn Optimizer
  if (lowercasePrompt.includes('linkedin')) {
    return `### 🚀 Optimized LinkedIn Profile Section\n\n**Headline:**\nSenior Full-Stack Engineer | React, TypeScript & Node.js | Scalable Cloud Architectures & AI Solutions\n\n**About Summary:**\nPassionate Software Engineer with a proven track record of designing high-performance full-stack web applications and scalable distributed systems. Specialized in TypeScript, React, Node.js, and PostgreSQL with a strong focus on system reliability, type safety, and clean architecture.\n\n**Core Competencies:**\n• Frontend: React 19, TypeScript, Tailwind CSS, Zustand, Next.js\n• Backend: Node.js, Express, REST APIs, Microservices, Prisma ORM\n• Database & Cloud: PostgreSQL, Docker, CI/CD, Google Gemini AI`;
  }

  // 15. Grammar Checker
  if (lowercasePrompt.includes('grammar') || lowercasePrompt.includes('grammatical')) {
    return `### ✨ Grammar & Tone Polished Output\n\n**Original Text Analyzed:** Corrected typos, capitalized pronouns, and improved sentence flow.\n\n**Polished Version:**\n> "I am writing to request leave today as I am feeling unwell and unable to attend work as scheduled."\n\n**Key Improvements:**\n- Fixed capitalization of the pronoun "I".\n- Replaced informal abbreviations with clear professional vocabulary.\n- Streamlined sentence cadence for enhanced clarity.`;
  }

  // 16. Content Summarizer & Text Tools
  if (lowercasePrompt.includes('summar') || lowercasePrompt.includes('rewrite')) {
    return `### 📝 Polished Summary & Key Takeaways\n\n- **Core Objective:** Structured execution, high performance, and reliable delivery.\n- **Key Highlights:**\n  1. Modular separation of concerns across client and server layers.\n  2. Robust error handling and automated type-safe validations.\n  3. Prioritizing responsive user experience and latency reduction.\n- **Next Actions:** Deploy verified changes and monitor runtime logs.`;
  }

  // Fallback AI Text Response for chat/generic prompts
  return `### 💡 SkillForge AI Assistant\n\nThank you for your request! Here is a targeted response for your inquiry:\n\n- **Architecture:** Maintain modular system design with clear separation of concerns across client and server layers.\n- **Robust Implementation:** Ensure type-safe schemas, comprehensive error handling, and performance optimization.\n- **Scalability:** Leverage connection pooling, caching strategies, and automated CI/CD pipelines.\n\n*Tip: Connect your live \`GEMINI_API_KEY\` in your \`backend/.env\` or Render dashboard for infinite live generation.*`;
}

// -------------------------------------------------------------
// Service Methods
// -------------------------------------------------------------

export const getAIChatResponse = async (messages: { role: string; content: string }[], systemInstruction?: string): Promise<string> => {
  const client = getGeminiClient();
  if (client && messages.length > 0) {
    const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro'];
    const lastMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    for (const modelName of modelsToTry) {
      try {
        const model = client.getGenerativeModel({ 
          model: modelName,
          ...(systemInstruction ? { systemInstruction } : {})
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        return response.text();
      } catch (error: any) {
        console.warn(`Gemini Chat (${modelName}) error:`, error?.message || error);
      }
    }

    // Direct fallback if chat history format failed
    for (const modelName of modelsToTry) {
      try {
        const model = client.getGenerativeModel({ model: modelName });
        const conversationText = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
        const prompt = systemInstruction ? `${systemInstruction}\n\n${conversationText}\nASSISTANT:` : `${conversationText}\nASSISTANT:`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (e) {
        // continue
      }
    }
  }

  // Fallback smart text response
  const lastPrompt = messages[messages.length - 1]?.content || '';
  return generateMockData(lastPrompt);
};

export const getAIChatWithDocResponse = async (documentText: string, messages: { role: string; content: string }[]): Promise<string> => {
  const contextInstruction = `You are a helpful reading assistant. Below is the text content of a document uploaded by the user. Use this text as context to answer their questions. Keep answers accurate and cite parts of the document when possible.\n\n=== DOCUMENT CONTENT ===\n${documentText.substring(0, 30000)}\n=== END OF DOCUMENT ===`;
  
  return getAIChatResponse(messages, contextInstruction);
};

export const runAIServiceTool = async (toolName: string, payload: any): Promise<string> => {
  let prompt = '';
  let systemInstruction = 'You are SkillForge AI, an expert career advisor, software architect, and productivity strategist.';

  switch (toolName) {
    case 'resume-analyzer':
      prompt = `Please analyze the following resume and return details in JSON format containing: "score" (number out of 100), "keywordsFound" (array), "missingKeywords" (array), "formattingFeedback" (string), and "contentFeedback" (string). \n\nResume content:\n${payload.resumeText}`;
      systemInstruction = 'You are an advanced Applicant Tracking System (ATS) scanner and technical recruiter. You must return ONLY valid, stringified JSON in the specified format.';
      break;

    case 'career-roadmap':
      prompt = `Develop a detailed technical career path roadmap for a user who wants to become a: "${payload.careerGoal}". Detail the milestones, timeline, topics to study, and practice project ideas in a raw JSON string containing "role" (string), "description" (string), and "milestones" (array of {phase, duration, topics, projects}).`;
      systemInstruction = 'You are a career consultant. Return ONLY valid stringified JSON matching the roadmap format.';
      break;

    case 'study-planner':
      prompt = `Develop a study plan or course curriculum for learning: "${payload.topic}". Return a raw JSON structure matching: "title" (string), "weeklySchedule" (array of {week, goal, days: [{day, task}]}).`;
      systemInstruction = 'You are a professional tutor. Return ONLY valid stringified JSON.';
      break;

    case 'mock-interview-questions':
      prompt = `Generate a list of 3 interview questions (1 technical, 1 behavioral, 1 coding) for a "${payload.role}" position in the "${payload.industry}" industry. Return as a raw JSON array of objects, each containing: "id" (string), "type" ("TECHNICAL" | "BEHAVIORAL" | "CODING"), "question" (string), and "optimalKeywords" (array of strings).`;
      systemInstruction = 'You are a Principal Tech Lead interviewer. Return ONLY valid stringified JSON.';
      break;

    case 'evaluate-interview-answer':
      prompt = `Evaluate the candidate's response. \nQuestion: "${payload.question}"\nCandidate's Answer: "${payload.answer}"\nReturn an evaluation in a raw JSON object containing "score" (0-100), "feedback" (detailed commentary), "missingPoints" (array of key details they missed), and "improvedAnswer" (a model response).`;
      systemInstruction = 'You are an interviewer evaluator. Return ONLY valid stringified JSON.';
      break;

    case 'speech-analysis':
      prompt = `Perform speed, pacing, and filler words analysis on this interview voice transcript:\n"${payload.transcript}". Return a raw JSON object containing "fillerWordsCount" (object with counts for words like "um", "like", "basically"), "speakingRateWPM" (number), "confidenceScore" (0-100), "pacingFeedback" (string), and "improvementAreas" (string).`;
      systemInstruction = 'You are a public speaking coach. Return ONLY valid stringified JSON.';
      break;

    case 'mind-map':
      prompt = `Generate a hierarchical mind map structure for the topic: "${payload.topic}". Return a raw JSON object containing "topic" (string) and "nodes" (array of {id, label, parentId?, type: "root" | "node"}). Make sure there is exactly one root node with no parentId.`;
      systemInstruction = 'You are a conceptual visualization assistant. Return ONLY valid stringified JSON.';
      break;

    case 'flashcards':
      prompt = `Generate a set of study flashcards for learning: "${payload.text || payload.topic}". Return a raw JSON array of objects, each containing "id" (number), "front" (question/concept), and "back" (explanation/answer).`;
      systemInstruction = 'You are a study card creator. Return ONLY valid stringified JSON.';
      break;

    case 'meeting-notes':
      prompt = `Summarize and extract Action Items from this meeting transcript:\n"${payload.transcript}"`;
      break;

    case 'task-generator':
      prompt = `Generate a checklist of tasks based on this project scope description:\n"${payload.scope}". Return a raw JSON array of objects, each containing "title" (string), "description" (string), "status" ("TODO"), and "priority" ("LOW" | "MEDIUM" | "HIGH").`;
      systemInstruction = 'You are a Project Management Office assistant. Return ONLY valid stringified JSON.';
      break;

    // Direct text modifiers
    case 'cover-letter':
      prompt = `Write a compelling cover letter based on this Resume: \n${payload.resumeText} \n\nFor this Job Description:\n${payload.jobDescription}`;
      break;
    case 'linkedin-optimizer':
      prompt = `Optimize the following LinkedIn profile section for maximum profile views, adding key buzzwords: \n${payload.profileText}`;
      break;
    case 'email-writer':
      prompt = `Write a professional email with subject "${payload.subject}". Extra details to include:\n${payload.prompt}`;
      break;
    case 'grammar-checker':
      prompt = `Correct any grammatical errors and return the polished text: \n"${payload.text}"`;
      break;
    case 'text-rewriter':
      prompt = `Rewrite this text in a ${payload.tone || 'professional'} tone: \n"${payload.text}"`;
      break;
    case 'content-summarizer':
      prompt = `Provide a concise summary with key bullet points for this text: \n"${payload.text}"`;
      break;
    case 'code-generator':
      prompt = `Write a well-documented code snippet in ${payload.language || 'TypeScript'} for: "${payload.prompt}"`;
      break;
    case 'code-explainer':
      prompt = `Explain how this code works: \n\`\`\`\n${payload.code}\n\`\`\``;
      break;
    case 'code-bugfix':
      prompt = `Identify issues and suggest bug fixes for this code: \n\`\`\`\n${payload.code}\n\`\`\``;
      break;
    case 'sql-generator':
      prompt = `Generate a SQL query for: "${payload.prompt}"`;
      break;
    case 'regex-generator':
      prompt = `Generate a regular expression (regex) for: "${payload.prompt}"`;
      break;
    case 'prompt-generator':
      prompt = `Enhance and rewrite this prompt into a highly effective prompt for an LLM: "${payload.prompt}"`;
      break;
    case 'blog-generator':
      prompt = `Write an engaging blog post about: "${payload.topic}"`;
      break;
    case 'social-media':
      prompt = `Generate a social media post (with hashtags) about: "${payload.topic}"`;
      break;
    case 'image-prompt':
      prompt = `Generate a highly detailed artistic image generation prompt for: "${payload.topic}"`;
      break;
    case 'productivity-planner':
      prompt = `Create a customized daily productivity schedule based on these goals:\n"${payload.goals}"`;
      break;

    default:
      prompt = `Process this request: ${JSON.stringify(payload)}`;
  }

  return generateAIResponse(prompt, systemInstruction);
};
