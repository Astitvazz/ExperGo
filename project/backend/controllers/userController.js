const User = require('../models/userModel');
const { USER_ROLES, HTTP_STATUS } = require('../utils/constants');

/**
 * Get all users (Admin only)
 * Returns all users with 'user' role
 */
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({ role: USER_ROLES.USER });
        return res.status(HTTP_STATUS.CREATED).json(allUsers);
    } catch (error) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: "Error while fetching users",
            error: error.message
        });
    }
};

/**
 * Get current user profile
 * Returns the profile of the authenticated user
 */
const getMyProfile = async (req, res) => {
    try {
        const myId = req.user.id;
        const userFound = await User.findById(myId);
        
        if (!userFound) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "User not found"
            });
        }

        return res.status(HTTP_STATUS.CREATED).json(userFound);
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Error occurred",
            error: error.message
        });
    }
};

/**
 * Get user by username
 * Returns user profile for a specific username
 */
const getUserByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const userFound = await User.findOne({ username: username });
        
        if (!userFound) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "User not found"
            });
        }

        return res.status(HTTP_STATUS.CREATED).json(userFound);
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Error occurred",
            error: error.message
        });
    }
};

/**
 * Delete user by ID (Admin only)
 * Removes a user from the database
 */
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDeleted = await User.deleteOne({ _id: userId });
        
        if (userDeleted.deletedCount === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "User not found"
            });
        }

        return res.status(HTTP_STATUS.CREATED).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Something went wrong",
            error: error.message
        });
    }
};

/**
 * Update current user profile
 * Allows user to update bio and avatar
 */
const updateMyProfile = async (req, res) => {
    try {
        const myId = req.user.id;
        const { bio } = req.body;
        const updates = {};

        if (typeof bio === 'string') {
            updates.bio = bio;
        }

        if (req.file?.path) {
            updates.avatar = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            myId,
            updates,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "User not found"
            });
        }

        return res.status(HTTP_STATUS.OK).json(updatedUser);
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Could not update profile",
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getMyProfile,
    getUserByUsername,
    deleteUser,
    updateMyProfile
};
