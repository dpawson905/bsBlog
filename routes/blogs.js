const express = require('express');
const router = express.Router();

const {
  asyncErrorHandler
} = require('../middleware');

const {
  getBlogs,
  newBlog
} = require('../controllers/blogs');

/* GET blog index page. */
router.get('/', asyncErrorHandler(getBlogs));

/* GET new blog page */
router.get('/new-blog', newBlog);

module.exports = router;