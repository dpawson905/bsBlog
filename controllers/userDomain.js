const User = require('../models/user');

module.exports = {
  async userIndex(req, res, next) {
    const user = await User.findOne({ username: req.vhost[0]});
    if (user) {
      res.send('User found');
    } else {
      res.send('No User');
    }
    console.log(req.vhost[0])
  }
}