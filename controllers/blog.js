const Blog = require('../models/blog.js');
const User = require('../models/user');
const moment = require('moment');
const slug = require('slug');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const { cloudinary } = require('../cloudinary/');

const { deleteProfileImage } = require('../middleware');

const showdown = require('showdown');
const showdownHighlight = require('showdown-highlight');
const prettify = require('showdown-prettify');
const converter = new showdown.Converter({
  extensions: [showdownHighlight, 'prettify']
});

module.exports = {
  async getBlog(req, res, next) {
    const blog = await Blog.findOne({ slug: req.params.slug });
    let decodeBlog = entities.decode(blog.content);
    blog.content = await converter.makeHtml(decodeBlog);
    res.render('blogs/view', {
      blog,
      subTitle: `- ${blog.title}`,
      url: 'blog'
    });
  },

  async getEditBlog(req, res, next) {
    const blog = await Blog.findOne({ slug: req.params.slug });
    res.render('blogs/edit', { blog });
  },

  async editBlog(req, res, next) {
    try {
      const blog = await Blog.findOne({ slug: req.params.slug });
      let tags = req.body.tags;
      req.body.tags = tags.split(',').map(tag => tag.trim());
      req.body.author = req.user._id;
      blog.content = entities.encode(req.body.content);
      if (req.body.featured) {
        const featureCheck = await Blog.findOne({ featured: true });
        if (featureCheck) {
          featureCheck.featured = false
          await featureCheck.save()
        }
        req.body.featured = true
      }
      blog.private = req.body.private;
      blog.archived = req.body.archived;
      if (req.file) {
        await cloudinary.v2.uploader.destroy(blog.image.public_id);
        const { secure_url, public_id } = req.file;
        blog.image = {
          secure_url,
          public_id
        };
      }
      if (req.body.title != blog.title) {
        req.body.title = req.sanitize(req.body.title);
        req.body.slug = await slug(moment(Date.now()).format("DD-MM-YYYY") + '-' + req.body.title);
        const slugCheck = await Blog.findOne({ slug: req.body.title });
        if (slugCheck) {
          req.body.slug = await slug(moment(Date.now()).format("DD-MM-YYYY") + '-' + req.body.title) + '-' + crypto.randomBytes(5).toString("hex");
        } else {
          req.body.slug = await slug(moment(Date.now()).format("DD-MM-YYYY") + '-' + req.body.title);
        }
      }
      await blog.save();
      req.flash('success', 'Blog updated');
      res.redirect(`/blogs/blog/${blog.slug}`)
    } catch (err) {
      deleteProfileImage(req);
      req.flash('error', err.message);
      return res.redirect('/blogs');
    }
  },

  async archiveBlog(req, res, next) {
    const blog = await Blog.findOne({slug: req.params.slug});
    if (blog.archived) {
      blog.archived = false
    } else {
      blog.archived = true
    }
    await blog.save();
    req.flash('success', `Blog has been ${blog.archived ? 'archived' : 'removed from the archive.'}`);
    res.redirect('back');
  }
};
