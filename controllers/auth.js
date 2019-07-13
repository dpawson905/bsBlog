const debug = require('debug')('bootstrapblogapp:auth');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const kickbox = require('kickbox')
  .client(process.env.KICKBOX_API_KEY)
  .kickbox();

const User = require('../models/user');
const Token = require('../models/token');

const kb_validate = process.env.KICKBOX_API_KEY;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  async getStarted(req, res, next) {
    if (req.user) {
      res.redirect('/blogs');
    } else {
      res.redirect('/users/register');
    }
  },

  getRegister(req, res, next) {
    res.render('auth/register', {
      subTitle: '- Register',
      url: 'register',
      userInfo: {
        firstName: "",
        lastName: "",
        email: "",
        username: ""
      },
      kb_validate
    });
  },

  async postRegisterUser(req, res, next) {
    const userInfo = req.body;
    if (process.env.KICKBOX_API_KEY) {
      debug('Kickbox enabled');
      await kickbox.verify(userInfo.email, async (err, response) => {
        if (response.body.result == 'deliverable') {
          if (req.file) {
            const { secure_url, public_id } = req.file;
            req.body.image = {
              secure_url,
              public_id
            };
          }
          try {
            const newUser = new User({
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              email: userInfo.email,
              username: userInfo.username,
              expiresDateCheck: null,
              isVerified: true
            });
            delete userInfo.password2;
            const user = await User.register(newUser, userInfo.password);
            await req.login(user, (err) => {
              if (err) return next(err);
              req.flash('success', `Welcome to SimpleBlog ${user.username}`);
              const redirectUrl = req.session.redirectTo || '/';
              delete req.session.redirectTo;
              res.redirect(redirectUrl);
            });
          } catch(err) {
            if (err.name === "MongoError" && err.code === 11000) {
              deleteProfileImage(req);
              const error = 'Sorry, this email address is already in use.';
              return res.render("auth/register", { 
                error, 
                userInfo, 
                subTitle: '- Register',
                url: 'register', 
                kb_validate
              });
            } else {
              deleteProfileImage(req);
              const error = err.message;
              return res.render("auth/register", { 
                error, 
                userInfo, 
                subTitle: '- Register',
                url: 'register',
                kb_validate
              });
            }
          }
        } else {
          const error = 'Sorry, this email address is invalid!';
          return res.render("auth/register", { 
            error, 
            userInfo, 
            subTitle: '- Register',
            url: 'register',
            kb_validate
          });
        }
      })
    } else {
      debug('Kickbox disabled');
      try {
        const newUser = new User({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          username: userInfo.username,
          expiresDateCheck: Date.now(),
          isVerified: false
        });
        delete userInfo.password2;
        const user = await User.register(newUser, userInfo.password);
        const userToken = new Token({
          _userId: user._id,
          token: crypto.randomBytes(256).toString("hex")
        });
        await userToken.save();
        const msg = {
          from: "SimpleBLog <darrellpawson@protonmail.com>",
          to: user.email,
          subject: `Welcome to SimpleBlog ${
            user.firstName
          } - Validate your account!`,
          html: `
                <h1>Hey There</h1>
                <p>It looks like you have registered for an account on our site, please click the link below to validate your account.</p>
                <p><a href="http://${req.headers.host}/users/validate-account?token=${userToken.token}">Validate your account</a></p>
              `
        };
        await sgMail.send(msg);
        req.flash('success', 'Thanks for registering, Please check your email to verify your account.');
        return res.redirect("/");
      } catch(err) {
        if (err.name === "MongoError" && err.code === 11000) {
          deleteProfileImage(req);
          const error = 'Sorry, this email address is already in use.';
          return res.render("auth/register", { 
            error, 
            userInfo, 
            subTitle: '- Register',
            url: 'register',
            kb_validate 
          });
        } else {
          deleteProfileImage(req);
          console.log(err)
          const error = err.message;
          return res.render("auth/register", { 
            error, 
            userInfo, 
            subTitle: '- Register',
            url: 'register',
            kb_validate 
          });
        }
      }
    }
  },

  async validateNewAccount(req, res, next) {
    const token = Token.findOne({ token: req.query.token });
    if (!token) {
      req.flash('error', 'This token is either invalid or expired. Please request a new one.');
      return res.redirect('/');
    }
    let user = await User.findOne({ id: token._userId });
    if (!user) {
      req.flash('error', 'Hmmmm, for some reason there is no user associated with that token. Please contact us so we can look into this.');
      return res.redirect('back');
    }
    user.isVerified = true;
    user.expiresDateCheck = null;
    await user.save();
    await token.remove();
    await req.login(user, (err) => {
      if (err) return next(err);
      req.flash('success', `Welcome to SimpleBlog ${user.username}`);
      const redirectUrl = req.session.redirectTo || '/';
      delete req.session.redirectTo;
      res.redirect(redirectUrl);
    });
  },

  getNewToken(req, res, next) {
    res.render('auth/newToken', {
      userInfo: {
        email: "",
      },
      title: 'Resend Token',
      subTitle: ''
    });
  },

  async postNewToken(req, res, next) {
    const userInfo = req.body;
    const user = await User.findOne({ email: userInfo.email });
    const token = await Token.findOne({ _userId: user.id });
    if (!user) {
      const error = "This email address does not exist!"
      return res.render('auth/newToken', { error, userInfo });
    }
    if(token){
      await token.remove();
    }
    const userToken = new Token({
      _userId: user._id,
      token: crypto.randomBytes(256).toString("hex")
    });
    await userToken.save();
    const msg = {
      from: "SimpleBLog <darrellpawson@protonmail.com>",
      to: user.email,
      subject: `Welcome to SimpleBlog ${
        user.firstName
      } - Validate your account!`,
      html: `
            <h1>Hey There</h1>
            <p>It looks like you have registered for an account on our site, please click the link below to validate your account.</p>
            <p><a href="http://${req.headers.host}/users/validate-account?token=${userToken.token}">Validate your account</a></p>
          `
    };
    await sgMail.send(msg);
    req.flash('success', 'Thanks for registering, Please check your email to verify your account.');
    return res.redirect("/");

  },

  async postLogin(req, res, next) {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
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
