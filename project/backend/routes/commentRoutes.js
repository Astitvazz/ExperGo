const express = require('express');
const router = express.Router();
const { checkToken } = require('../middleware/auth');
const { getCommentsByBlogId } = require('../controllers/commentController');

/**
 * Comment Management Routes
 * Handles comment retrieval and management
 */

// GET /api/comment/:blogId - Get all comments for a specific blog
router.get('/:blogId', checkToken, getCommentsByBlogId);

module.exports = router;