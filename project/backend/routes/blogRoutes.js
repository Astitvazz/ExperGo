const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');
const { checkToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    createBlog,
    getAllBlogs,
    getMyBlogs,
    getBlogById,
    getBlogsByUserId,
    toggleLike,
    updateBlog,
    deleteBlog
} = require('../controllers/blogController');
const { addComment } = require('../controllers/commentController');

/**
 * Blog Management Routes
 * Handles blog creation, retrieval, and interactions
 */

// POST /api/blog - Create a new blog post
router.post('/', checkToken, upload.array('images'), createBlog);

// GET /api/blog - Get all blog posts
router.get('/', getAllBlogs);

// GET /api/blog/mine - Get current user's blog posts
router.get('/mine', checkToken, getMyBlogs);

// GET /api/blog/:id - Get specific blog by ID
router.get('/:id', checkToken, getBlogById);

// GET /api/blog/user/:userid - Get blogs by user ID
router.get('/user/:userid', checkToken, getBlogsByUserId);

// PATCH /api/blog/like/:id - Toggle like on a blog post
router.patch('/like/:id', checkToken, toggleLike);
router.patch('/:id', checkToken, upload.array('images'), updateBlog);
router.delete('/:id', checkToken, deleteBlog);

// POST /api/blog/comment/:id - Add comment to a blog post
router.post('/comment/:id', checkToken, addComment);

module.exports = router;
