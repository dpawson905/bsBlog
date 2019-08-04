const express = require('express');
const router = express.Router({mergeParams: true});

const {
  isLoggedIn,
  asyncErrorHandler
} = require('../middleware');

const {
    getUserBlogs
} = require('../controllers/userBlog');

/* GET home page. */
router.get('/', asyncErrorHandler(getUserBlogs));

module.exports = router;
