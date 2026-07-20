import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/db';
import { getAIChatResponse, getAIChatWithDocResponse, runAIServiceTool } from '../services/ai.service';

// Credit Cost map per tool
const creditCosts: Record<string, number> = {
  'chat': 1,
  'doc-chat': 1,
  'resume-analyzer': 2,
  'career-roadmap': 3,
  'study-planner': 2,
  'mock-interview-questions': 2,
  'evaluate-interview-answer': 2,
  'speech-analysis': 2,
  'mind-map': 1,
  'flashcards': 1,
  'meeting-notes': 1,
  'task-generator': 1,
  'cover-letter': 2,
  'linkedin-optimizer': 2,
  'email-writer': 1,
  'grammar-checker': 1,
  'text-rewriter': 1,
  'content-summarizer': 1,
  'code-generator': 1,
  'code-explainer': 1,
  'code-bugfix': 1,
  'sql-generator': 1,
  'regex-generator': 1,
  'prompt-generator': 1,
  'blog-generator': 2,
  'social-media': 1,
  'image-prompt': 1,
  'productivity-planner': 1,
};

export const chatAssistant = async (req: AuthenticatedRequest, res: Response) => {
  const { messages, systemInstruction } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const cost = creditCosts['chat'];

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < cost) {
      return res.status(402).json({ error: 'Insufficient credits. Please upgrade or purchase more credits.' });
    }

    const reply = await getAIChatResponse(messages, systemInstruction);

    // Deduct credits and log activity
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: cost } },
      }),
      prisma.aIRequestLog.create({
        data: {
          userId,
          toolUsed: 'AI Chat Assistant',
          creditsUsed: cost,
          status: 'SUCCESS',
        },
      }),
    ]);

    return res.status(200).json({ reply, creditsRemaining: user.credits - cost });
  } catch (error: any) {
    console.error('Chat Assistant error:', error);
    return res.status(500).json({ error: 'AI processing failed.' });
  }
};

export const chatWithDocument = async (req: AuthenticatedRequest, res: Response) => {
  const { documentId, messages } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const cost = creditCosts['doc-chat'];

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < cost) {
      return res.status(402).json({ error: 'Insufficient credits.' });
    }

    const document = await prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const reply = await getAIChatWithDocResponse(document.textContent, messages);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: cost } },
      }),
      prisma.aIRequestLog.create({
        data: {
          userId,
          toolUsed: `Doc Chat (${document.name})`,
          creditsUsed: cost,
          status: 'SUCCESS',
        },
      }),
    ]);

    return res.status(200).json({ reply, creditsRemaining: user.credits - cost });
  } catch (error) {
    console.error('Doc Chat error:', error);
    return res.status(500).json({ error: 'AI parsing failed.' });
  }
};

export const runAITool = async (req: AuthenticatedRequest, res: Response) => {
  const { toolName, payload } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const cost = creditCosts[toolName] || 1;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < cost) {
      return res.status(402).json({ error: 'Insufficient credits. Upgrade to premium for unlimited usage!' });
    }

    const result = await runAIServiceTool(toolName, payload);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: cost } },
      }),
      prisma.aIRequestLog.create({
        data: {
          userId,
          toolUsed: toolName.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          creditsUsed: cost,
          status: 'SUCCESS',
        },
      }),
    ]);

    return res.status(200).json({ result, creditsRemaining: user.credits - cost });
  } catch (error) {
    console.error(`AI Tool ${toolName} error:`, error);
    return res.status(500).json({ error: 'AI calculation failed.' });
  }
};
