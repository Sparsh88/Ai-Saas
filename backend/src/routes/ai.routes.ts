import { Router } from 'express';
import { chatAssistant, chatWithDocument, runAITool } from '../controllers/ai.controller';
import { authenticateJWT } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { aiToolSchema } from '../utils/schemas';

const router = Router();

router.use(authenticateJWT);

router.post('/chat', chatAssistant);
router.post('/chat-document', chatWithDocument);
router.post('/tool', validate(aiToolSchema), runAITool);

export default router;
