const passport = require('passport');
const Dog = require('../models/Dog');
const User = require('../models/User');
const Comment = require('../models/Comment');

/**
 * GET /addDog
 * Add Dog Page
 */
exports.getAddDog = (ensureAuthenticated, (req, res) => {
  User.findById(req.user._id).populate('dogs').exec(function(err, result) {
    res.render('account/addDog', {
      title: 'Add Dog', user: result
    });
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
      if(req.file){
          dog.picture = '/uploads/' + req.file.filename;
      }
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


// Get Dog page
exports.getEditDog = function(req, res){
  Dog.findById(req.params.id).populate('comments').exec(function(err, dog){
    if(err){
      console.log(err);
      return;
    }

    User.findById(dog.owner).populate('dogs').exec(function(owner_err, dog_owner){
      if(owner_err){
        console.log(owner_err);
        return;
      }

      User.findById(req.user._id).populate('dogs').exec(function(user_err, cur_user){
        if(user_err){
          console.log(user_err);
          return;
        }
  
        /* If user is logged in and is dog's owner, show edit page */
        if(req.user && req.user._id == dog.owner){
          res.render("account/editDog", {
            title:'Dog ' + dog.name,
            dog: dog, owner: dog_owner, user: cur_user
          });
        }

        /* If another user just browsing, show dog page */ 
        else {
          res.render("dog", {
            title:'Dog ' + dog.name,
            dog: dog, owner: dog_owner, user: cur_user
          });
        }

      });
    });
  });
};

//Post route to add comment
exports.postComment = function(req,res){
  Dog.findById(req.body.palid, function(err, paldog){
    const newComment = new Comment({
      username : req.body.username,
      userid: req.body.userid,
      content : req.body.comment,
      palid: req.body.palid,
      palname: paldog.name,
      dogid: req.params.id,
      created : Date.now()
    }).save( function(err, comment, count){
      Dog.findByIdAndUpdate(
        req.params.id,
        {$push: {comments: comment}},
        {safe: true, upsert: true},
        function(err, model) {
          if(err){
            console.log(err);
          }
          req.flash('success', { msg: 'Message submitted.' });
          res.redirect('/dog/'+req.params.id);
        }
      );
    });
  });
}

//Post route for Update to Dog
exports.postUpdateDog = function(req, res){
  let dog = {};
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
  if(req.file){
    dog.picture = '/uploads/' + req.file.filename;
  }
  
  let query = {_id:req.params.id}
  Dog.update(query, dog, (err) =>{
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', {msg: `${dog.name} has been updated`});
      res.redirect('/dog/'+req.params.id);
    }
  });
}

/**
 * POST /dog/delete
 * Delete dog
 */
exports.postDeleteDog = (req, res, next) => {
  
  Dog.remove({ _id: req.params.id }, (err) => {
    if (err) throw err;
    req.flash('info', { msg: `Dog has been deleted.` });
    res.redirect('/account');
  });
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