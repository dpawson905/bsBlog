const express = require('express');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const router = express.Router();

const {
  getStarted,
  getRegister,
  postRegisterUser,
  postLogin,
  logOut
} = require('../controllers/auth');

const {
  asyncErrorHandler
} = require('../middleware');

/* Get Started */
router.get('/get-started', asyncErrorHandler(getStarted));

/* GET register page. */
router.get('/register', getRegister);

/* POST user */
router.post('/register', upload.single('image'), asyncErrorHandler(postRegisterUser));

/* POST login */
router.post('/login', asyncErrorHandler(postLogin));

/* Logout */
router.get('/logout', logOut);

module.exports = router;
