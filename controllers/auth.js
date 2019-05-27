const kickbox = require("kickbox")
  .client(process.env.KICKBOX_API_KEY)
  .kickbox();

const User = require("../models/user");
const { cloudinary } = require("../cloudinary");
const { deleteProfileImage } = require("../middleware");

module.exports = {
  async getStarted(req, res, next) {
    if (req.user) {
      res.redirect('/blogs');
    } else {
      res.redirect('/users/register');
    }
  },

  getRegister(req, res, next) {
    res.render("auth/register", {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      image: '',
      title: 'SimpleBlog - Register',
      url: 'register'
    });
  },
};