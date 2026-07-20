import fs from 'fs';
import mammoth from 'mammoth';

// Use require for pdf-parse to avoid import/declaration errors in TS
const pdfParse = require('pdf-parse');

export const extractTextFromFile = async (filePath: string, originalName: string): Promise<string> => {
  const ext = originalName.split('.').pop()?.toLowerCase();

  if (!fs.existsSync(filePath)) {
    throw new Error('File not found on system.');
  }

  try {
    switch (ext) {
      case 'pdf': {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text || '';
      }

      case 'docx': {
        const dataBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        return result.value || '';
      }

      case 'txt':
      case 'md': {
        const text = fs.readFileSync(filePath, 'utf-8');
        return text;
      }

      default:
        throw new Error(`Extraction for .${ext} files is not supported. Please upload a PDF, DOCX, TXT, or MD file.`);
    }
  } catch (error: any) {
    console.error('Error parsing file content:', error);
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};
