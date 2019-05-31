const Blog = require('../models/blog');
const User = require('../models/user');

module.exports = {
  async getBlogs(req, res, next) {
    const blogs = await Blog.find({ author: req.user._id});
    res.render('blogs/index', {
      blogs,
      subTitle: '- Your Blogs'
    });
  },

  newBlog(req, res, next) {
    res.render('blogs/new', {
      subTitle: '- New Blog'
    });
  }
}