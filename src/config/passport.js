const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');
const UserService = require('../services/user.service');

module.exports = function(passport){

  passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
  },
    function(login, password, done) {
      User.findOne({login: login}, function(err, user){
        if(err) { return done(err);}
        if(!user) { return done(null, false, { message: 'login incorrect' });}

        UserService.validPassword(password, user.password, function(err, isMatch) {
          if(err) { return done(err);}
          if(isMatch) { return done(null, user);}
          else { return done(null, false, {message: 'password incorrect'});}
        })
      })
    }
  ));


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
} 



