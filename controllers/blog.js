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
    /* const user = await User.find().populate('followers').exec();
    console.log(user[0].followers[0].username) */
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
    blog.content = entities.decode(blog.content);
    res.render('blogs/edit', { blog });
  },

  async editBlog(req, res, next) {
    const { featured } = req.body;
    try {
      const blog = await Blog.findOne({ slug: req.params.slug });
      let tags = req.body.tags;
      req.body.tags = tags.split(',').map(tag => tag.trim());
      req.body.author = req.user._id;
      blog.content = entities.encode(req.body.content);
      if (featured) {
        const checkOtherFeatured = await Blog.findOne({ featured: true });
        if (checkOtherFeatured && checkOtherFeatured.slug != req.params.slug) {
          checkOtherFeatured.featured = false
        } else {
          blog.featured = true
        }
      }
      if (!featured) blog.featured = false;
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
      console.log(err)
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
  },

  async followers(req, res, next) {
    const blog = await Blog.findOne({ slug: req.body.slug });
    const blogFollower = await User.findById(req.user.id);
    blogFollower.following.push(blog.author);
    await blogFollower.save()
    const blogOwner = await User.findById(blog.author.id);
    blogOwner.followers.push(blogFollower);
    await blogOwner.save();
    req.flash('success', `You are now following ${blog.author.firstName}`);
    return res.redirect('back');
  }
};
