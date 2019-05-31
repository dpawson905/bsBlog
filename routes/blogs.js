const express = require('express');
const router = express.Router();

const {
  getBlogs
} = require('../controllers/blogs');

/* GET home page. */
router.get('/', getBlogs);

module.exports = router;