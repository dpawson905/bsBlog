const Blog = require('../models/blog');
const User = require('../models/user');

module.exports = {
  async getBlogs(req, res, next) {
    const user = await User.findById(req.user.id);
    const blogs = await Blog.find();
    res.render('blogs/index', {
      blogs,
      user,
      subTitle: '- Your Blogs'
    });
  },
}