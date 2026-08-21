import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/db';
import { getAIChatResponse, getAIChatWithDocResponse, runAIServiceTool } from '../services/ai.service';
import { invalidateDashboardCache } from './workspace.controller';

export const chatAssistant = async (req: AuthenticatedRequest, res: Response) => {
  const { messages, systemInstruction } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    const reply = await getAIChatResponse(messages, systemInstruction);

    // Log AI activity
    await prisma.aIRequestLog.create({
      data: {
        userId,
        toolUsed: 'AI Chat Assistant',
        creditsUsed: 0,
        status: 'SUCCESS',
      },
    }).catch((err) => console.warn('Activity log write skipped:', err));

    invalidateDashboardCache(userId);

    return res.status(200).json({ reply });
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

  try {
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const reply = await getAIChatWithDocResponse(document.textContent, messages);

    await prisma.aIRequestLog.create({
      data: {
        userId,
        toolUsed: `Doc Chat (${document.name})`,
        creditsUsed: 0,
        status: 'SUCCESS',
      },
    }).catch((err) => console.warn('Activity log write skipped:', err));

    invalidateDashboardCache(userId);

    return res.status(200).json({ reply });
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

  try {
    const result = await runAIServiceTool(toolName, payload);

    await prisma.aIRequestLog.create({
      data: {
        userId,
        toolUsed: toolName.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        creditsUsed: 0,
        status: 'SUCCESS',
      },
    }).catch((err) => console.warn('Activity log write skipped:', err));

    invalidateDashboardCache(userId);

    return res.status(200).json({ result });
  } catch (error) {
    console.error(`AI Tool ${toolName} error:`, error);
    return res.status(500).json({ error: 'AI calculation failed.' });
  }
};

