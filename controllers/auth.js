const passport = require('passport');
const kickbox = require("kickbox")
  .client(process.env.KICKBOX_API_KEY)
  .kickbox();

const User = require("../models/user");
const { cloudinary } = require("../cloudinary");
const { deleteProfileImage } = require("../middleware");

module.exports = {
  async getStarted(req, res, next) {
    if (req.user) {
      res.redirect("/blogs");
    } else {
      res.redirect("/users/register");
    }
  },

  getRegister(req, res, next) {
    res.render("auth/register", {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      subTitle: "- Register",
      url: "register"
    });
  },

  async postRegisterUser(req, res, next) {
    const { firstName, lastName, email, username } = req.body;
    let error;
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        req.flash(
          "error",
          "This email address is in use. Please login using your email address."
        );
        return res.redirect("/");
      }

      if (process.env.KICKBOX_API_KEY) {
        await kickbox.verify(req.body.email, async (err, response) => {
          if (err) {
            req.flash("error", err.message);
            return res.redirect("/users/register");
          }
          if (response.body.result == "deliverable") {
            if (req.body.password !== req.body.password2) {
              error = "Passwords to not match";
              res.render("auth/register", {
                firstName,
                lastName,
                email,
                username,
                error,
                url: 'register',
                subTitle: '- Register'
              });
            }
            console.log(req.file)
            if (req.file) {
              const { secure_url, public_id } = req.file;
              req.body.image = {
                secure_url,
                public_id
              };
            }
            const user = await User.register(
              new User(req.body),
              req.body.password
            );
            await req.login(user, function(err) {
              if (err) return next(err);
              req.flash("success", `Welcome to SimpleBlog ${user.username}`);
              const redirectUrl = req.session.redirectTo || "/";
              delete req.session.redirectTo;
              res.redirect(redirectUrl);
            });
          } else {
            error = "This is not a valid email address";
            console.log(req.body);
            res.render("auth/register", {
              firstName,
              lastName,
              email,
              username,
              error,
              url: 'register',
              subTitle: '- Register'
            });
          }
        });
      } else {
        console.log(req.file)
        if (req.file) {
          const { secure_url, public_id } = req.file;
          req.body.image = {
            secure_url,
            public_id
          };
        }
        console.log(req.body);
        const user = await User.register(new User(req.body), req.body.password);
        req.flash("success", `Thanks for signing up ${user.username}`);
      }
    } catch (err) {
      deleteProfileImage(req);
      req.flash("error", err.message);
      return res.redirect("/users/register");
    }
  },

  async postLogin(req, res, next) {
    const user = await User.findOne({ username: req.body.username });
    if(!user) {
      req.flash('error', 'Invalid Username');
      return res.redirect('/');
    }
    await passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      successFlash: `Welcome back ${user.username}`,
      failureFlash: true
    })(req, res, next);
  },

  logOut(req, res, next) {
    req.logout();
    return res.redirect('/');
  }
};
