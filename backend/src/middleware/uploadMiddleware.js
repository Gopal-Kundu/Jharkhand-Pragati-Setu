import multer from 'multer';

/**
 * Multer Memory Storage Configuration
 * Stores uploaded multimedia evidence (images, videos, documents) in memory buffer
 * for secure streaming to Cloudinary
 */
const storage = multer.memoryStorage();

// File filter to permit images, videos, audio, and documents
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    // Videos
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/webm',
    'audio/ogg',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: Images, Videos, Audio, PDFs, and Documents.`), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // Max 50MB per file
  },
  fileFilter
});

export default upload;
