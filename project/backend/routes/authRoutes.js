const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

/**
 * Authentication Routes
 * Handles user registration and login
 */

// POST /api/auth/register - Register a new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

module.exports = router;