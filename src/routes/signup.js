const { check, validationResult } = require('express-validator');
const User = require('../mongoose/model/user.model');

module.exports = function (app) {

  app.get('/login', function (req, res) {
    res.render('login', {errors: [req.flash('error')]});
  });

  app.get('/signup', function (req, res) {
    res.render('signup', {errors: [req.flash('error')]});
  });

  app.post('/signup', [
    check('firstName').not().isEmpty().withMessage('Prénom requis'),
    check('lastName').not().isEmpty().withMessage('Nom de famille requis'),
    check('login').matches(/[A-Za-z0-9_\-]+/).withMessage('Caractère non autorisé dans login')
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

  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', {
        errors: errors.array()
      });
    }

    let userInstance = new User({
      login: req.body.login,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mail: req.body.mail,
      projects: []
    })

    User.createUser(userInstance, function (err, user) {
      if (err) return handleError(err);
      res.render('signup', {
        success: 'Inscription réussie !'
      })
    });
  });
}