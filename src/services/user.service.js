const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Project = require('../models/project.model');
const { check, validationResult } = require('express-validator');

module.exports.validateSignUp = () => {
  return [
    check('firstName').not().isEmpty().withMessage('Prénom requis'),
    check('lastName').not().isEmpty().withMessage('Nom de famille requis'),
    check('login').matches(/^[A-Za-z0-9_\-]+$/).withMessage('Caractère non autorisé dans login')
      .custom((value, { req }) => { //login unique dans la DB
        return new Promise((resolve, reject) => {
          User.findOne({ login: req.body.login }, function (err, user) {
            if (err) {
              reject(new Error('Erreur serveur'))
            }
            if (Boolean(user)) {
              reject(new Error('Login déjà utilisé'))
            }
            resolve(true)
          });
        });
      }),
    check('mail').isEmail().withMessage('email non valide').custom((value, { req }) => {//email unique dans la DB
      return new Promise((resolve, reject) => {
        User.findOne({ mail: req.body.mail }, function (err, user) { //mail unique dans db
          if (err) {
            reject(new Error('Erreur Serveur'))
          }
          if (Boolean(user)) {
            reject(new Error('Email déjà utilisé'))
          }
          resolve(true)
        });
      });
    }),
    check('password').isLength({ min: 5 }).withMessage('le mot de passe doit faire au moins 5 caractères')
  ];
}

module.exports.validPassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}

module.exports.createUser = function (userObject) {
  return new Promise(function (resolve) {
    let userInstance = new User(userObject);
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(userInstance.password, salt, function (err, hash) {
        if (err) throw err;
        userInstance.password = hash;
        userInstance.save((err) => {
          if (err) throw err;
          resolve()
        });
      });
    });
  });
}

module.exports.getProjects = function getProjects(user) {
  return new Promise(function (resolve) {
    let res = [];
    if (typeof user.projects == 'undefined' || user.projects.length === 0) {
      resolve(res);
    }
    let promises = [];
    user.projects.forEach(project_id => {
      promises.push(Project.findById(project_id).exec())
    });
    Promise.all(promises).then(values => {
      resolve(values);
    });
  });
}