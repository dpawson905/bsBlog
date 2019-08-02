const User = require('../models/user');

module.exports = {
  async userIndex(req, res, next) {
    const user = await User.findOne({ username: req.vhost[0]});
    res.send(user);
    console.log(req.vhost[0])
  }
}