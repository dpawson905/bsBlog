if (app.get("env") == "development") {
  require("dotenv").config();
}
const debug = require("debug")("bootstrapblogapp:app");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require("connect-flash");
const helmet = require("helmet");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongo")(session);
const passport = require("passport");
const methodOverride = require("method-override");
const sassMiddleware = require("node-sass-middleware");
const expressSanitizer = require("express-sanitizer");

const { asyncErrorHandler } = require("./middleware");
const { getNotifications } = require("./controllers/blogs");

// DB MODEL FILES
const User = require("./models/user.js");

const blogRouter = require("./routes/blog");
const blogsRouter = require("./routes/blogs");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

// Connect to db
mongoose
  .connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => {
    debug("Connected to MongoDB");
  })
  .catch(err => {
    debug(err.message);
  });

const store = new MongoDBStore({
  mongooseConnection: mongoose.connection,
  touchAfter: 24 * 3600,
  secret: process.env.COOKIE_SECRET
});
// Catch errors
store.on("error", function(error) {
  console.log("STORE ERROR!!!", error);
});

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(expressSanitizer());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    debug: false,
    // outputStyle: 'compressed',
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.locals.moment = require("moment");
app.use(methodOverride("_method"));

const sess = {
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60,
    maxAge: 1000 * 60 * 60
  },
  store,
  resave: true,
  saveUninitialized: false
};

if (app.get("env") === "production") {
  app.set("trust proxy", true); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(flash());
app.use(session(sess));
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.title = "SimpleBlog";
  res.locals.url = "";
  res.locals.currentUser = req.user;
  res.locals.isAuthenticated = req.user ? true : false;
  next();
});

// app.all('*', asyncErrorHandler(getNotifications));
app.use("/", indexRouter);
app.use("/blogs", blogsRouter);
app.use("/blogs/blog", blogRouter);
app.use("/users", usersRouter);

// catch 404 and display message to user
app.use(function(req, res, next) {
  req.flash("error", "That page does not exist.");
  res.redirect("/");
  next();
});

// error handler
app.use(function(err, req, res, next) {
  debug(err.stack);
  req.flash("error", err.message);
  res.redirect("/");
});

module.exports = app;
