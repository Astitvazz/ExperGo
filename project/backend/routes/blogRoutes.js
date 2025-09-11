const express = require('express');
const router = express.Router();
const { checkToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    createBlog,
    getAllBlogs,
    getMyBlogs,
    getBlogById,
    getBlogsByUserId,
    toggleLike
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

// PATCH /api/blog/toggle-status/:id
// PATCH /api/blog/toggle-status/:id
router.patch("/toggle-status/:id", checkToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // only the author can toggle
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    blog.draft = !blog.draft; // toggle
    await blog.save();

    res.json({ message: "Status updated", draft: blog.draft });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// POST /api/blog/comment/:id - Add comment to a blog post
router.post('/comment/:id', checkToken, addComment);

module.exports = router;