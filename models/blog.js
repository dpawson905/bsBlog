const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const date = Date.now();

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
    type: Date
  },
  featured: {
    type: Boolean,
    default: false
  },
  archived: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

BlogSchema.index({
  title: 'text',
  tags: 'text'
});

// pre-hook middleware to populate author in question index routes
BlogSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

BlogSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);