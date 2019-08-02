const User = require('../models/user');

module.exports = {
  async userIndex(req, res, next) {
    const user = await User.findOne({ username: req.vhost[0]});
    if (user) {
      req.flash('success', 'User found');
      return res.redirect('/');
    } else {
      req.flash('error', 'User not found');
      return res.redirect('/');
    }
    console.log(req.vhost[0])
  }
}