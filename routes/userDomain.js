const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const router = express.Router();

const { userIndex } = require("../controllers/userDomain");

const {
  asyncErrorHandler,
  isLoggedIn,
  isAuthenticated,
  isNotAuthenticated
} = require("../middleware");

router.get("/", asyncErrorHandler(userIndex));

module.exports = router;
