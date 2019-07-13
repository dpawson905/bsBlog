const express = require('express');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const router = express.Router();

const {
  asyncErrorHandler,
  isLoggedIn,
  isAuthenticated,
  isNotAuthenticated
} = require('../middleware');

const {
  getBlogs,
  getNewBlog,
  postNewBlog
} = require('../controllers/blogs');

/* GET blog index page. */
router.get('/', isNotAuthenticated, asyncErrorHandler(getBlogs));

/* GET new blog page */
router.get('/new-blog', isLoggedIn, getNewBlog);

/* POST blog */
router.post('/new-blog', upload.single('image'), isLoggedIn, asyncErrorHandler(postNewBlog));

module.exports = router;