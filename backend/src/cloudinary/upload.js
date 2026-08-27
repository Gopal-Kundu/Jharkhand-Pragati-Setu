import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Cloudinary SDK with environment credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload any media file (Image, Video, Audio, or Document) to Cloudinary
 * 
 * @param {Buffer|string} fileInput - Memory buffer from multer or file path / base64 string
 * @param {Object} options - Upload options (folder, resourceType, fileName)
 * @returns {Promise<{ url: string, publicId: string, format: string, bytes: number, resourceType: string }>} Upload result object with secure link
 */
export const uploadMediaToCloudinary = async (fileInput, options = {}) => {
  const {
    folder = 'sih2026_societal_evidence',
    resourceType = 'auto', // 'image' | 'video' | 'raw' | 'auto'
    fileName = `evidence_${Date.now()}`
  } = options;

  // Check if real Cloudinary credentials are provided in .env
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== '123456789012345';

  if (!isCloudinaryConfigured) {
    // If running in development with placeholder credentials, return a valid mock CDN url
    const safeType = resourceType === 'video' ? 'video' : 'image';
    const mockUrl = resourceType === 'video'
      ? `https://assets.mixkit.co/videos/preview/mixkit-water-flowing-through-the-river-42352-large.mp4`
      : `https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80`;

    console.log(`[Cloudinary] Notice: Demo credentials detected. Generated simulated CDN link for ${fileName}: ${mockUrl}`);
    
    return {
      url: mockUrl,
      publicId: `sih2026_demo_${Date.now()}`,
      format: safeType === 'video' ? 'mp4' : 'jpg',
      bytes: 1048576,
      resourceType: safeType,
      isSimulated: true
    };
  }

  // Real Cloudinary Upload via buffer stream or path
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: fileName,
        overwrite: true
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]:', error);
          return reject(error);
        }
        resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          resourceType: result.resource_type,
          isSimulated: false
        });
      }
    );

    if (Buffer.isBuffer(fileInput)) {
      uploadStream.end(fileInput);
    } else if (typeof fileInput === 'string' && fileInput.startsWith('data:')) {
      // Base64 string directly upload
      cloudinary.uploader.upload(fileInput, { folder, resource_type: resourceType, public_id: fileName })
        .then(result => resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          resourceType: result.resource_type,
          isSimulated: false
        }))
        .catch(reject);
    } else {
      // File path upload
      cloudinary.uploader.upload(fileInput, { folder, resource_type: resourceType, public_id: fileName })
        .then(result => resolve({
          url: result.secure_url || result.url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          resourceType: result.resource_type,
          isSimulated: false
        }))
        .catch(reject);
    }
  });
};

export default {
  uploadMediaToCloudinary
};
