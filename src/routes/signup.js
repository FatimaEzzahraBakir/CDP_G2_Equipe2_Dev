const { check, validationResult } = require('express-validator');

module.exports = function (app) {

  const User = require('../mongoose/model/user.model');

  app.get('/login', function (req, res) {
    res.render('login');
  });

  app.get('/signup', function (req, res) {
    res.render('signup');
  });

  app.post('/signup', [
    check('firstName').not().isEmpty(),
    check('lastName').not().isEmpty(),
    check('login').not().isEmpty().custom((value, { req }) => { //login unique dans la DB
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
        User.findOne({ mail: req.body.mail }, function (err, user) {
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