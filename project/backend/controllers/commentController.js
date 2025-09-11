const Comment = require('../models/commentModel');
const Blog = require('../models/blogModel');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Add a comment to a blog post
 * Creates a new comment and adds it to the blog's comments array
 */
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const blogId = req.params.id;
        const authorId = req.user.id;

        // Create new comment
        const newComment = new Comment({
            content,
            blog: blogId,
            author: authorId
        });

        await newComment.save();

        // Add comment to blog's comments array
        await Blog.findByIdAndUpdate(blogId, {
            $push: { comments: newComment._id }
        });

        return res.status(HTTP_STATUS.CREATED).json({
            message: "Comment added successfully!",
            comment: newComment
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error occurred while adding comment",
            error: error.message
        });
    }
};

/**
 * Get all comments for a specific blog
 * Returns all comments associated with a blog ID
 */
const getCommentsByBlogId = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const allComments = await Comment.find({ blog: blogId }).populate('author');
        
        return res.json(allComments);
    } catch (error) {
        console.error("Error fetching comments:", error.message);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: error.message
        });
    }
};

module.exports = {
    addComment,
    getCommentsByBlogId
};