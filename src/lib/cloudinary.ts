import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables or provided defaults
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'df1epf6ic',
    api_key: process.env.CLOUDINARY_API_KEY || '564336836828412',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'siKA0IM9IOHKk0uCswzWqkjgm98', // MUST be in Env Vars
    secure: true,
});

export default cloudinary;
