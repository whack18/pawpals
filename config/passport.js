const passport = require('passport');
const request = require('request');

const LocalStrategy = require('passport-local').Strategy;
const { OAuthStrategy } = require('passport-oauth');
const { OAuth2Strategy } = require('passport-oauth');
const config = require('../config/database');

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
  //Match email
  // User.findOne({ email: email.toLowerCase() }, (err, user) => {
  //   if (err) { return done(err); }
  //   if (!user) {
  //     return done(null, false, { msg: `Email ${email} not found.` });
  //   }
    //Match username
    let query = { username: username };
    User.findOne(query, (err, user) => {
      if(err){ return done(err);}
      if(!user){
        return done(null, false, { msg: `No user ${username} was found.`})
      }
     
      //Match password
      user.comparePassword(password, (err, isMatch) => {
        if (err) { return done(err); }
        if (isMatch) {
          return done(null, user); //Everything passed
        } else {
        return done(null, false, { msg: 'Invalid username or password.' });
        }
      });
   });
}));

/**
* Login Required middleware.
*/
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
* Authorization Required middleware.
*/
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
