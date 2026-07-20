import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/db';
import { extractTextFromFile } from '../services/parser.service';
import { uploadToCloudinary } from '../middleware/upload';

export const uploadDocument = async (req: AuthenticatedRequest, res: Response) => {
  const file = req.file;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    // Extract text from the staging file
    const extractedText = await extractTextFromFile(file.path, file.originalname);

    // Upload to Cloudinary or save path local URL
    const fileUrl = await uploadToCloudinary(file.path);

    const doc = await prisma.document.create({
      data: {
        name: file.originalname,
        url: fileUrl,
        fileType: file.mimetype,
        textContent: extractedText,
        userId,
      },
    });

    return res.status(201).json({
      message: 'Document uploaded and parsed successfully.',
      document: {
        id: doc.id,
        name: doc.name,
        url: doc.url,
        fileType: doc.fileType,
        createdAt: doc.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Document upload/parse error:', error);
    return res.status(500).json({ error: error.message || 'File processing failed.' });
  }
};

export const getDocuments = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    const docs = await prisma.document.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        url: true,
        fileType: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(docs);
  } catch (error) {
    console.error('Get documents error:', error);
    return res.status(500).json({ error: 'Server error retrieving documents.' });
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    const doc = await prisma.document.findFirst({
      where: { id, userId },
    });

    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    await prisma.document.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Document deleted successfully.' });
  } catch (error) {
    console.error('Delete document error:', error);
    return res.status(500).json({ error: 'Server error deleting document.' });
  }
};
