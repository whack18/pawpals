const passport = require('passport');
const Dog = require('../models/Dog');

/**
 * GET /addDog
 * Add Dog Page
 */
exports.getAddDog = (ensureAuthenticated, (req, res) => {
  res.render('account/addDog', {
    title: 'Add Dog'
  });
});

/**
 * POST /account/addDog
 * Add dog to account
 */
exports.postAddDog = (req, res, next) => {
  req.assert('name', 'Name is required.').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/addDog');
  } else {
      let dog = new Dog();
      dog.name = req.body.name;
      dog.owner = req.user._id; //Connects dog to the user
      dog.breed = req.body.breed || '';
      dog.weight = req.body.weight || '';
      dog.gender = req.body.gender || '';
      dog.age = req.body.age || '';
      dog.fixed = req.body.fixed || '';
      dog.temperament = req.body.temperament || '';
      dog.energy_level = req.body.energy_level || '';
      dog.about = req.body.about || '';
      dog.picture = req.file.filename || '';
      dog.save((err) => {
          if(err){
              console.log(err);
              return;
          }
          else{
            req.user.dogs.push(dog);
            req.user.save();
            req.flash('success', { msg: `${dog.name} has been added!` });
            res.redirect('/account');
          }
      });
    }
};

//Access control - User must be logged in to access this url 
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('errors', {msg :'Please login'});
        res.redirect('/login');
    }
    
}