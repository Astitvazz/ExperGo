const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  content:  { type: String, required: true },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags:     [String],
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  draft:    {type:Boolean,default:false},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  isApproved: { type: Boolean, default: true },
  link:    { type: String},
  images: [
    {
      type: String,     // Stores Cloudinary URLs   
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
