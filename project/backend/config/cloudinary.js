const cloudinary = require('cloudinary').v2;

/**
 * Cloudinary configuration for image upload and management
 * Uses environment variables for secure credential management
 */

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

module.exports = cloudinary;