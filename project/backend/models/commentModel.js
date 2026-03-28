const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    blog:    { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
