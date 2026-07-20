import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('WARNING: GEMINI_API_KEY is not defined in environment. Running AI Service in Mock/Demo mode.');
}

// Helper to run prompt or fallback to mock
async function generateAIResponse(prompt: string, systemInstruction?: string): Promise<string> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: systemInstruction
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error, falling back to mock response:', error);
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
    return JSON.stringify({
      role: 'Full Stack Engineer',
      description: 'A developer capable of building both interactive interfaces (frontend) and scalable server architectures (backend).',
      milestones: [
        {
          phase: 'Phase 1: Advanced JavaScript & TypeScript',
          duration: '4-6 Weeks',
          topics: ['Asynchronous patterns', 'Generics & type assertions', 'Event Loop mechanics', 'NPM modules structure'],
          projects: ['Build a lightweight HTTP router library from scratch']
        },
        {
          phase: 'Phase 2: Backend Foundations (Node & Express)',
          duration: '6-8 Weeks',
          topics: ['RESTful Routing', 'Prisma ORM & SQL constraints', 'Session & Token-based Auth', 'Middleware pipeline'],
          projects: ['Construct an e-commerce API server with credit card simulation']
        },
        {
          phase: 'Phase 3: Frontend Mastery (React & State)',
          duration: '8-10 Weeks',
          topics: ['Custom hooks creation', 'Optimistic UI updates', 'State engines (Zustand, Redux Toolkit)', 'Tailwind system design'],
          projects: ['Build a real-time collaborative whiteboarding web app']
        },
        {
          phase: 'Phase 4: Devops & Cloud Infrastructure',
          duration: '4 Weeks',
          topics: ['Docker containers', 'GitHub Actions CI/CD workflows', 'PostgreSQL replication', 'Serverless deployment'],
          projects: ['Deploy custom React-Express app to VPS instance with SSL certificates auto-renewing']
        }
      ]
    }, null, 2);
  }

  // 3. Mock Interview Practice Questions
  if (lowercasePrompt.includes('interview') && lowercasePrompt.includes('question')) {
    return JSON.stringify([
      {
        id: 'q1',
        type: 'TECHNICAL',
        question: 'Explain the difference between SQL JOIN operations (INNER, LEFT, RIGHT, FULL) and how index structures optimize queries.',
        optimalKeywords: ['B-Tree', 'Hash Index', 'Cartesian Product', 'Index Scan']
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
      score: 82,
      feedback: 'Great start. You explained the concepts of INNER and LEFT JOIN correctly. To score higher, make sure to describe how index scans avoid full table scans, mentioning the B-Tree structure used by PostgreSQL by default.',
      missingPoints: ['Mention of primary vs secondary indexes', 'Time complexity changes from O(N) to O(log N)'],
      improvedAnswer: 'An INNER JOIN matches records present in both tables, whereas a LEFT JOIN yields all left rows and matched right rows. Database indexes optimize this by keeping data sorted in a B-Tree structure, transforming sequential scans to index scans, reducing retrieval from O(N) to O(log N).'
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
      topic: 'React State Management',
      nodes: [
        { id: '1', label: 'React State Management', type: 'root' },
        { id: '2', label: 'Component State (useState, useReducer)', parentId: '1' },
        { id: '3', label: 'Context API (Global Prop Drilling Solution)', parentId: '1' },
        { id: '4', label: 'External Libraries', parentId: '1' },
        { id: '5', label: 'Zustand (Minimalist Flux)', parentId: '4' },
        { id: '6', label: 'Redux Toolkit (Enterprise Standard)', parentId: '4' },
        { id: '7', label: 'Jotai / Recoil (Atomic State)', parentId: '4' }
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
    return JSON.stringify({
      title: 'Full-Stack JavaScript Mastery',
      weeklySchedule: [
        {
          week: 'Week 1',
          goal: 'Understand Advanced JavaScript Concepts',
          days: [
            { day: 'Monday', task: 'Review Prototypal Inheritance & Closures' },
            { day: 'Wednesday', task: 'Practice async/await and Promise.all API calls' },
            { day: 'Friday', task: 'Build a small event emitter utility' }
          ]
        },
        {
          week: 'Week 2',
          goal: 'Database Modeling & ORMs',
          days: [
            { day: 'Monday', task: 'Learn PostgreSQL normalization & relations' },
            { day: 'Wednesday', task: 'Configure Prisma models and associations' },
            { day: 'Friday', task: 'Write custom seeding scripts for relational tables' }
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
      return `### Code Explanation\nThis block of code is a function that merges overlapping intervals. Here is how it works step-by-step:\n\n1. **Sort by start time:** It first sorts the array of intervals in ascending order based on their start coordinates.\n2. **Initialize merge list:** It keeps an array \`merged\` containing the first interval as a baseline.\n3. **Loop & Compare:** For each subsequent interval, it checks if its start time is less than or equal to the end time of the last interval in the \`merged\` list.\n4. **Combine:** If they overlap, it updates the end time of the last interval. If not, it pushes the new interval as a separate entry.`;
    }
    if (lowercasePrompt.includes('fix') || lowercasePrompt.includes('bug')) {
      return `### Bug Fix Suggestion\n\n**Issue:** The index loop goes out of bounds, and comparing \`arr[i]\` doesn't handle empty lists.\n\n**Corrected Code:**\n\`\`\`typescript\nfunction processItems(arr: string[]) {\n  if (!arr.length) return;\n  for (let i = 0; i < arr.length; i++) {\n    console.log(arr[i].trim());\n  }\n}\n\`\`\``;
    }
    if (lowercasePrompt.includes('sql')) {
      return `SELECT u.id, u.name, SUM(p.amount) as total_spent \nFROM "User" u \nJOIN "Payment" p ON u.id = p.userId \nWHERE p.status = 'SUCCESS' \nGROUP BY u.id, u.name \nHAVING SUM(p.amount) > 1000 \nORDER BY total_spent DESC;`;
    }
    if (lowercasePrompt.includes('regex')) {
      return `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/`;
    }
    return `\`\`\`typescript\n// Generated Coding Assistant Block\nexport function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {\n  let timeout: NodeJS.Timeout;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => func(...args), wait);\n  };\n}\n\`\`\``;
  }

  // Fallback AI Text Response for chat/generic prompts
  return `This is a high-quality response simulated by SkillForge AI Workspace. To enable live dynamic responses from Gemini 1.5, add a valid \`GEMINI_API_KEY\` to your \`backend/.env\` configuration file.\n\nHere is some detailed guidance on your prompt:\n- Maintain a modular architecture in your application.\n- Incorporate proper type validations via TypeScript interfaces and zod schemas.\n- Integrate credits tracker logging to monitor credit transactions.`;
}

// -------------------------------------------------------------
// Service Methods
// -------------------------------------------------------------

export const getAIChatResponse = async (messages: { role: string; content: string }[], systemInstruction?: string): Promise<string> => {
  // Format history for Gemini chat structure
  if (genAI && messages.length > 0) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction });
      const lastMessage = messages[messages.length - 1].content;
      const history = messages.slice(0, -1).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini Chat API Error:', error);
    }
  }

  // Fallback to simulator
  const lastMsg = messages[messages.length - 1]?.content || '';
  return generateMockData(lastMsg);
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
