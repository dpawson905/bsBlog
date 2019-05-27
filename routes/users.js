var express = require('express');
var router = express.Router();

const {
  getStarted,
  getRegister
} = require('../controllers/auth');

const {
  asyncErrorHandler
} = require('../middleware');

/* Get Started */
router.get('/get-started', asyncErrorHandler(getStarted));

/* GET register page. */
router.get('/register', getRegister);

module.exports = router;
