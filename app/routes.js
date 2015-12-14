var mongoose = require('mongoose');
require('./models/user');
require('./models/recipe');
module.exports = function(app, passport) {
  // normal routes ===============================================================
  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

// PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user
    });
  });
  app.get('/calculator', isLoggedIn, function(req, res) {
    res.render('calc.ejs', {
      user: req.user
    });
  });
// LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
// AUTHENTICATE (FIRST LOGIN)
  // locally --------------------------------
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });
  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/calculator', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
  // google ---------------------------------
  // send to google to do the authentication
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));
  // the callback after google has authenticated the user
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/calculator',
    failureRedirect: '/'
  }));
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT)
  // locally --------------------------------
  app.get('/connect/local', function(req, res) {
    res.render('connect-local.ejs', {
      message: req.flash('loginMessage')
    });
  });
  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
  // google ---------------------------------
  // send to google to do the authentication
  app.get('/connect/google', passport.authorize('google', {
    scope: ['profile', 'email']
  }));
  // the callback after google has authorized the user
  app.get('/connect/google/callback', passport.authorize('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));
// UNLINK ACCOUNTS
  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });
  // google ---------------------------------
  app.get('/unlink/google', isLoggedIn, function(req, res) {
    var user = req.user;
    user.google.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  //
  // test to serve page from mongodb
  //
  var user = mongoose.model('User');

      app.get("/users", function(req, res){
    user.find({}, function(err, users) {
      var userMap = {};

      users.forEach(function(user) {
        userMap[user._id] = [user._id, user.local.email, user.google.email];
      });

      res.send(userMap);  
    });
  });
  //    
  // end test
  //

};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}