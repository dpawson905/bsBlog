const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const User = require('../models/user');
const Blogs = require('../models/blog');

module.exports = {
  async getProfile(req, res, next) {
    let user = await User.findById(req.user.id);
    let blogs = await Blogs.find({ 'author': req.user.id })
    console.log(blogs)
    res.render('profile/index', { blogs, user, url: 'profile', subTitle: '- Profile' });
  }
}