const Project = require('../models/project.model');
const Test = require('../models/test.model');
const { check, validationResult } = require('express-validator');

module.exports.getTest = function (test_id) {
    return new Promise(function (resolve) {
      Test.findById(resq.params.test_id).then((err, test) => {
        if (err) throw err;
        resolve(test);
      })
    });
  }
  
module.exports.validateNewTest = function () {
    return [
      check('num', 'ID invalide').not().isEmpty().isInt().custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          Test.findOne({
            num: req.body.num,
            project: req.params.project_id
          },
            function (err, test) { //ID unique dans le projet
              if (err) {
                reject(new Error('Erreur Serveur'))
              }
              if (Boolean(test)) {
                reject(new Error('ID déjà utilisé'))
              }
              resolve(true)
            });
        });
      }),
      check('name', 'nom requis').not().isEmpty(),
      check('expectedResult', 'resultat attendu requis').not().isEmpty(),
      check('obtainedResult', 'resultat obtenu requis').not().isEmpty(),
      check('level', 'niveau requis').not().isEmpty()
    ];
  }