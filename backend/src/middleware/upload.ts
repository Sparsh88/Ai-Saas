import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Cloudinary if credentials are provided
const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Set up disk storage for local uploads / staging
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for documents and images
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedExtensions = ['.pdf', '.docx', '.txt', '.md', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Supported formats: PDF, DOCX, TXT, MD, PNG, JPG, JPEG. Received extension: ${ext}`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadToCloudinary = async (filePath: string): Promise<string> => {
  if (!useCloudinary) {
    // Generate a local serving URL instead
    const fileName = path.basename(filePath);
    return `/uploads/${fileName}`;
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      folder: 'skillforge-ai',
    });
    // Remove local staging file
    fs.unlinkSync(filePath);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed, falling back to local file URL:', error);
    const fileName = path.basename(filePath);
    return `/uploads/${fileName}`;
  }
};
