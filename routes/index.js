var express = require('express');
var router = express.Router();

const {
  getIndex
} = require('../controllers');

/* GET home page. */
router.get('/', getIndex);

module.exports = router;
