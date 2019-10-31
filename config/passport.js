const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../src/mongoose/model/user.model');

module.exports = function(passport){


  passport.use(new LocalStrategy(
    function(login, password, done) {
      User.findOne({login: login}, function(err, user){
        if(err) { return done(err);}
        if(!user) { return done(null, false, { message: 'login incorrect' });}
        if(!user.validPassword(password)){
          return done(null, false, {message: 'password incorrect'});
        }
        return done(null, user);
      })
    }
  ));
  
} 



