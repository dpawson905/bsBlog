const { cloudinary } = require('../cloudinary');

module.exports = {
  asyncErrorHandler: fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  },

  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      req.flash('error', 'You are currently logged in.');
      res.redirect('/');
    } else {
      return next();
    }
  },

  isNotAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error', 'You must be logged in to view this page');
      req.session.redirectTo = req.originalUrl;
      res.redirect('/users/login');
    }
  },

  // isAdmin checker
  isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.roles.admin) {
      return next();
    }
    req.flash('error', 'You don\'t have the privileges to do that.');
    res.redirect('/users/login');
  },

  deleteProfileImage: async req => {
    if (req.file) await cloudinary.v2.uploader.destroy(req.file.public_id);
  }
};