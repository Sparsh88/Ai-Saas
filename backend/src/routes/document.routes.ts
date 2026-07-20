import { Router } from 'express';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/document.controller';
import { authenticateJWT } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticateJWT);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.delete('/:id', deleteDocument);

export default router;
