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
  isVerified: {
    type: Boolean,
    required: true
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
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  expiresDateCheck: {
    type: Date,
    default: undefined,
    // if user is not verified then the account will be removed in 24 hours
    expires: 86400
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

// pre-hook middleware to populate author in question index routes
UserSchema.pre('find', function(next) {
  this.populate('followers');
  next();
});

UserSchema.pre('findOne', function(next) {
  this.populate('followers');
  next();
});
UserSchema.pre('find', function(next) {
  this.populate('following');
  next();
});

UserSchema.pre('findOne', function(next) {
  this.populate('following');
  next();
});

module.exports = mongoose.model('User', UserSchema);
