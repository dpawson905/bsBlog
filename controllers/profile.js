const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const util = require('util');
const User = require('../models/user');
const Blogs = require('../models/blog');

module.exports = {
  async getProfile(req, res, next) {
    let user = await User.findById(req.user.id).limit(10);
    let blogs = await Blogs.find({ author: req.user.id })
    res.render('profile/index', { blogs, user, url: 'profile', subTitle: '- Profile' });
  },

  async putEditProfile(req, res, next) {
    const { username, email, private } = req.body;
    const { currentUser } = res.locals;
    if (username) currentUser.username = username;
    if (email) currentUser.email = email;
    if (req.file) {
      if (currentUser.image.public_id)
        // Changed user to currentUser
        await cloudinary.v2.uploader.destroy(currentUser.image.public_id);
      const { secure_url, public_id } = req.file;
      currentUser.image = {
        secure_url,
        public_id
      };
    }
    if (private) currentUser.private = true;
    if (!private) currentUser.private = false;
    await currentUser.save();
    const login = util.promisify(req.login.bind(req));
    await login(currentUser);
    req.flash('success', 'Profile updated.')
    res.redirect('back');
  }
}