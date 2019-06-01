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
  async getBlogs(req, res, next) {
    const blogs = await Blog.find({ 
      author: {
        $eq: req.user._id
      },
      publishDate: {
        $lte: Date.now()
      }
    });
    res.render('blogs/index', {
      blogs,
      subTitle: '- Your Blogs',
      entities,
      converter
    });
  },

  getNewBlog(req, res, next) {
    res.render('blogs/new', {
      subTitle: '- New Blog'
    });
  },

  async postNewBlog(req, res, next) {
    try {
      let tags = req.body.tags;
      req.body.tags = tags.split(',').map(tag => tag.trim());
      req.body.author = req.user._id;
      if (req.file) {
        const { secure_url, public_id } = req.file;
        req.body.image = {
          secure_url,
          public_id
        };
      }
      if (!req.body.publishDate) {
        req.body.publishDate = Date.now();
      }
      req.body.content = entities.encode(req.body.content);
      req.body.slug = await slug(moment(Date.now()).format("DD-MM-YYYY") + '-' + req.body.title);
      console.log(req.body)
      await Blog.create(req.body);
      req.flash('success', 'Blog created Successfully');
      res.redirect('/blogs');
    } catch(err) {
      console.log(err)
      deleteProfileImage(req);
      req.flash('error', err.message);
      return res.redirect('/blogs');
    }
  }
}