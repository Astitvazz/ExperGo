const jwt = require('jsonwebtoken');
const { JWT_SECRET, USER_ROLES, HTTP_STATUS } = require('../utils/constants');

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header and verifies it
 * Adds decoded user info to req.user
 */
const checkToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: "No authorization header provided"
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: "No token is provided"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: "Invalid or expired token"
        });
    }
};

/**
 * Middleware to check if user has admin role
 * Must be used after checkToken middleware
 */
const checkAdmin = (req, res, next) => {
    if (req.user.role !== USER_ROLES.ADMIN) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: "Admin access only"
        });
    }
    next();
};

module.exports = {
    checkToken,
    checkAdmin
};