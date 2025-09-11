const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { JWT_SECRET, JWT_EXPIRES_IN, HTTP_STATUS } = require('../utils/constants');

/**
 * Register a new user
 * Validates unique username and email, hashes password, and creates user
 */
const register = async (req, res) => {
    const { username, email, password, role, avatar, bio } = req.body;
    
    try {
        // Check if username already exists
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                field: "username",
                message: "Username already exists"
            });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                field: "email",
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user object
        const newUserData = {
            username,
            email,
            password: hashedPassword,
            role,
            avatar,
            bio
        };

        // Save user to database
        const user = new User(newUserData);
        await user.save();

        // Remove password from response
        const userResponse = { ...newUserData };
        delete userResponse.password;

        res.status(HTTP_STATUS.CREATED).json({
            message: "User registered successfully",
            user: userResponse
        });
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error occurred during registration",
            error: error.message
        });
    }
};

/**
 * Login user
 * Validates credentials and returns JWT token
 */
const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Find user by username
        const userToBeValidated = await User.findOne({ username: username });
        if (!userToBeValidated) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "User not found"
            });
        }

        // Validate password
        const isValid = await bcrypt.compare(password, userToBeValidated.password);
        if (!isValid) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: userToBeValidated._id, 
                role: userToBeValidated.role 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return res.status(HTTP_STATUS.OK).json({
            message: "Login successful",
            token: token
        });
    } catch (error) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            message: "Error generating token",
            error: error.message
        });
    }
};

module.exports = {
    register,
    login
};