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
  getBlog
} = require('../controllers/blog');

/* GET home page. */
router.get('/:slug', isNotAuthenticated, asyncErrorHandler(getBlog));

module.exports = router;