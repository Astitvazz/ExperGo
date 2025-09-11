const Blog = require('../models/blogModel');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Create a new blog post
 * Handles blog creation with multiple image uploads
 */
const createBlog = async (req, res) => {
    try {
        const { title, content, link,draft } = req.body;
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const newBlog = new Blog({
            title,
            content,
            link,
            images: imageUrls,
            author: req.user.id,
            draft: draft === "true"
        });

        await newBlog.save();

        res.status(HTTP_STATUS.CREATED).json({
            message: "Blog created successfully!",
            blog: newBlog
        });
    } catch (error) {
        console.log("Error creating blog:", error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: error.message
        });
    }
};

/**
 * Get all blog posts
 * Returns all blogs with populated author information
 */
const getAllBlogs = async (req, res) => {
  try {
    const { draft } = req.query; 
    let filter = {};

    if (draft !== undefined) {
      filter.draft = draft === "true"; // convert string to boolean
    }

    const allBlogs = await Blog.find(filter).populate('author');
    res.status(200).json(allBlogs);  // ✅ always 200 for GET
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      message: "Error while fetching the blogs",
      error: error.message
    });
  }
};



/**
 * Get current user's blog posts
 * Returns blogs created by the authenticated user
 */
const getMyBlogs = async (req, res) => {
    try {
        const myId = req.user.id;
        const myBlogs = await Blog.find({ author: myId });
        res.status(HTTP_STATUS.CREATED).json(myBlogs);
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Error while fetching your blogs",
            error: error.message
        });
    }
};

/**
 * Get a specific blog by ID
 * Returns blog with populated comments and comment authors
 */
const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId).populate({
            path: 'comments',
            populate: { path: 'author' }
        });

        if (!blog) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Blog not found"
            });
        }

        res.status(HTTP_STATUS.CREATED).json(blog);
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Error while fetching the blog",
            error: error.message
        });
    }
};

/**
 * Get blogs by specific user ID
 * Returns all blogs created by a specific user
 */
const getBlogsByUserId = async (req, res) => {
    try {
        const userId = req.params.userid;
        const blogs = await Blog.find({ author: userId });
        res.json(blogs);
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Can't fetch blogs",
            error: error.message
        });
    }
};

/**
 * Toggle like on a blog post
 * Adds or removes user from blog's likes array
 */
const toggleLike = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;
        const { liked } = req.body;

        let updatedBlog;

        if (liked) {
            // Remove like if already liked
            updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                { $pull: { likes: userId } },
                { new: true }
            );
        } else {
            // Add like if not already liked
            updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                { $addToSet: { likes: userId } },
                { new: true }
            );
        }

        if (!updatedBlog) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Blog not found"
            });
        }

        return res.json(updatedBlog.likes);
    } catch (error) {
        console.error("Error toggling like:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: error.message
        });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getMyBlogs,
    getBlogById,
    getBlogsByUserId,
    toggleLike
};