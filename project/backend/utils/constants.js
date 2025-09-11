/**
 * Application constants
 * Centralized place for all application-wide constants
 */

const JWT_SECRET = process.env.JWT_SECRET || '1234';
const JWT_EXPIRES_IN = '25d';

// User roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// HTTP Status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Cloudinary settings
const CLOUDINARY_SETTINGS = {
  FOLDER: 'BubbleBlogUploads',
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png','gif','webp'],
  TRANSFORMATION: [{ width: 800, height: 600, crop: 'limit' }]
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  USER_ROLES,
  HTTP_STATUS,
  CLOUDINARY_SETTINGS
};