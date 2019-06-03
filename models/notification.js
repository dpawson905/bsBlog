const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
	blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
	isRead: { type: Boolean, default: false }
});

// pre-hook middleware to populate author in question index routes
notificationSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

notificationSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

notificationSchema.pre('find', function(next) {
  this.populate('blogId');
  next();
});

notificationSchema.pre('findOne', function(next) {
  this.populate('blogId');
  next();
});

module.exports = mongoose.model("Notification", notificationSchema);