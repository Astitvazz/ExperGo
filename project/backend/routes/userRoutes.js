const express = require('express');
const router = express.Router();
const { checkToken, checkAdmin } = require('../middleware/auth');
const {
    getAllUsers,
    getMyProfile,
    getUserByUsername,
    deleteUser
} = require('../controllers/userController');

/**
 * User Management Routes
 * All routes require authentication, some require admin privileges
 */

// GET /api/user - Get all users (Admin only)
router.get('/', checkToken, checkAdmin, getAllUsers);

// GET /api/user/me - Get current user's profile
router.get('/me', checkToken, getMyProfile);

// GET /api/user/:username - Get user by username
router.get('/:username', checkToken, getUserByUsername);

// DELETE /api/user/:id - Delete user by ID (Admin only)
router.delete('/:id', checkToken, checkAdmin, deleteUser);

module.exports = router;