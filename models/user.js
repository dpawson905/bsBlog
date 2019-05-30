const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    lowercase: true,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    lowercase: true,
    required: true,
    trim: true
  },
  roles: {
    admin: {
      type: Boolean,
      default: false
    },
    manager: {
      type: Boolean,
      default: false
    },
    basic: {
      type: Boolean,
      default: true
    },
  },
  image:  {
		secure_url: { type: String, default: '/images/no-user.jpg' },
		public_id: String
  },
  likes: {
    type: Array,
  },
  followers: {
    type: Array
  }
}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose, {
  limitAttempts: true,
  interval: 100,
  // 300000ms is 5 min
  maxInterval: 300000,
  // This will completely lock out an account and requires user intervention.
  maxAttempts: 10
});

module.exports = mongoose.model('User', UserSchema);
