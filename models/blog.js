const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const BlogSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  image:  {
		secure_url: { type: String, default: '/images/blog.jpeg' },
		public_id: String
  },
  likes: {
    type: Array,
  },
  tags: {
    type: [String],
    trim: true
  },
  slug: {
    type: String,
    trim: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);