const Blog = require('../models/blog.js');
const User = require('../models/user');
const moment = require('moment');
const slug = require('slug');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const {
  cloudinary
} = require('../cloudinary/');

const { 
  deleteProfileImage
} = require("../middleware");

const showdown = require('showdown');
const showdownHighlight = require('showdown-highlight');
const prettify = require('showdown-prettify');
const converter = new showdown.Converter({
  extensions: [
    showdownHighlight,
    'prettify'
  ]
});

module.exports = {
  async getBlog(req, res, next) {
    const blog = await Blog.findOne({ slug: req.params.slug });
    console.log(blog)
    let decodeBlog = entities.decode(blog.content);
    blog.content = await converter.makeHtml(decodeBlog);
    res.render('blogs/view', { 
      blog,
      subTitle: `- ${blog.title}`,
      url: 'blog'
    });
  }
}