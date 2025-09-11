const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { CLOUDINARY_SETTINGS } = require('../utils/constants');

/**
 * Cloudinary storage configuration for multer
 * Handles file uploads to Cloudinary with automatic transformations
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: CLOUDINARY_SETTINGS.FOLDER,
    allowed_formats: CLOUDINARY_SETTINGS.ALLOWED_FORMATS,
    transformation: CLOUDINARY_SETTINGS.TRANSFORMATION
  },
});

/**
 * Multer upload middleware configured with Cloudinary storage
 * Can be used for single or multiple file uploads
 */
const upload = multer({ storage: storage });

module.exports = upload;