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
  getBlog,
  getEditBlog,
  editBlog,
  archiveBlog
} = require('../controllers/blog');

/* GET home page. */
router.get('/:slug', isNotAuthenticated, asyncErrorHandler(getBlog));

/* GET blog edit */
router.get('/:slug/edit', isNotAuthenticated, asyncErrorHandler(getEditBlog));

/* PUT edit blog */
router.put('/:slug', upload.single('image'), isNotAuthenticated, asyncErrorHandler(editBlog));

/* PUT archive blog */
router.put('/:slug/archive', isNotAuthenticated, asyncErrorHandler(archiveBlog));

module.exports = router;