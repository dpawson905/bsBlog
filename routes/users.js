const express = require('express');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const router = express.Router();

const {
  getStarted,
  getRegister,
  postRegisterUser,
  validateNewAccount,
  getNewToken,
  postNewToken,
  postLogin,
  logOut
} = require('../controllers/auth');

const {
  getProfile
} = require('../controllers/profile');

const {
  asyncErrorHandler,
  isLoggedIn
} = require('../middleware');

/* Get Started */
router.get('/get-started', asyncErrorHandler(getStarted));

/* GET register page. */
router.get('/register', getRegister);

/* POST user */
router.post('/register', upload.single('image'), asyncErrorHandler(postRegisterUser));

/* GET validate-account */
router.get('/validate-account', asyncErrorHandler(validateNewAccount));

/* GET new-token */
router.get('/new-token', getNewToken);

/* POST new-token */
router.post('/new-token', asyncErrorHandler(postNewToken));

/* POST login */
router.post('/login', asyncErrorHandler(postLogin));

/* Logout */
router.get('/logout', logOut);

/* GET user profile */
router.get('/user/:id', isLoggedIn, asyncErrorHandler(getProfile));

module.exports = router;
