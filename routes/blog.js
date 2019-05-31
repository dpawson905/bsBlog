const express = require('express');
const router = express.Router();

const {
  getBlog
} = require('../controllers/blog');

/* GET home page. */
router.get('/', getBlog);

module.exports = router;