const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const User = require('../models/user');

module.exports = {
  async getProfile(req, res, next) {
    let user = await User.findById(req.user.id);
    res.render('profile/index', { user, url: 'profile', subTitle: '- Profile' });
  }
}