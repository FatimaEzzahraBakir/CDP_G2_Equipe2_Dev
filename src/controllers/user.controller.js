const UserService = require('../services/user.service');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { check, validationResult } = require('express-validator');


exports.validate = () => {
  return UserService.validateSignUp();
}

exports.UserProjectListGet = async function (req, res, next) {
  let user = req.user;
  projects = await UserService.getProjects(user);
  return res.render('projects', {
    user: user.login,
    projects: projects
  });
}

exports.UserLoginGet = function (req, res, next) {
  res.render('signin', { error: req.flash('error') });
}

exports.UserLoginPost = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/signin',
  failureFlash: true
})

exports.UserSignupGet = function (req, res, next) {
  res.render('signup', { errors: [req.flash('error')] });
}

exports.UserSignupPost = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('signup', {
      errors: errors.array()
    });
  }

  let userObject = {
    login: req.body.login,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mail: req.body.mail,
    projects: []
  };

  await UserService.createUser(userObject);
  res.render('signup', { success: 'Inscription réussie !' });
}

exports.UserLogoutGet = function (req, res, next) {
  req.logout();
  res.redirect('/');
}