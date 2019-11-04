const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){

  app.get('/signin', function(req, res) {
    res.render('signin',{error: req.flash('error')});
  });

  app.post('/signin', passport.authenticate('local', {successRedirect: '/',
                                                      failureRedirect: '/signin',
                                                      failureFlash: true}));
}