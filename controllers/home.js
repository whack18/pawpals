const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User');
const Dogs = require('../models/Dog');
const zipcodes = require('zipcodes');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res, next) => {
/* If user is logged in, Home page shows Dashboard */
  if (req.user) {

    /* MongoDB query parameters */
    const query = { location:
      { $near :
         {
           $geometry : req.user.location,
           $maxDistance : 1000000   // 1000 km
         }
      }
    }

    /* Find users matching parameters, populate Dogs */
    User.find(query).populate('dogs').exec(function (err, result) {
      if (err) return next(err);

      /* result contains all users found (including logged in user) and their dogs */

      let cur_user;
      for(let i=0; i<result.length; i++){
        if(String(result[i]._id) === String(req.user._id)){
          cur_user = result[i];
        }
      }

      res.render('dashboard', {
        title: 'Dashboard', result: result, user:cur_user
      });
    });

  /* If user is not logged in, render signup page */
  } else {
    res.render('home', {
      title: 'Home'
    });
  }
};
