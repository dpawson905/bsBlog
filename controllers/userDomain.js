const User = require("../models/user");
const Blogs = require("../models/blog");

module.exports = {
  async userIndex(req, res, next) {
    if (req.isAuthenticated) {
      const user = await User.findOne({ username: req.vhost[0] });
      if (user) {
        const blogs = await Blogs.find({ 'author.id': user.id});
        res.render('blogs/index', {
          subTitle: `${user.username}'s blogs`,
          blogs
        });
      } else {
        let error = 'This user does not exist'
        const userCheck = ''
        res.render("index", { 
          error, 
          subTitle: '', 
          url: 'home',
          userCheck 
        });
      }
    } else {
      console.log('Ugh')
    }
  }
};
