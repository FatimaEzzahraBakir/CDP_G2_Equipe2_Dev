const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
}