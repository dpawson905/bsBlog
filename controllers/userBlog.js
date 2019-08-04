const User = require('../models/user');
const Blog = require('../models/blog');

module.exports = {
  async getUserBlogs(req, res, next) {
    const user = await User.findOne({username: req.params.username});
    if(user) {
      res.send(user);
    } else {
      res.send('No user')
    }
  }
}