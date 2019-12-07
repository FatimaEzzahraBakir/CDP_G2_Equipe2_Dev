const Project = require('../models/project.model');
const Test = require('../models/test.model');
const Issue = require('../models/issue.model');
const { check, validationResult } = require('express-validator');

module.exports.getTest = function (test_id) {
    return new Promise(function (resolve) {
        Test.findById(test_id).then((err, test) => {
            console.log(test);
            if (err) throw err;
            resolve(test);
        });
    });
};

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
        check('level', 'niveau requis').not().isEmpty().isInt()
    ];
}

module.exports.createTest = function (testObject) {
    return new Promise(function (resolve) {
      let testInstance = new Test(testObject);
      testInstance.save((err, test) => {
            if (err) throw err;
            Project.findByIdAndUpdate(
              test.project,
              { $push: { tests: test.id } },
              (err) => {
                if (err) throw err;
                resolve();
              });
          
      });
    });
  }

module.exports.deleteTest = function (test_id) {
    return new Promise(function (resolve) {
        Test.findOneAndDelete(
            { _id: test_id },
            (err, test) => {
                if (err) throw err;
                Project.findByIdAndUpdate(
                    test.project,
                    { $pull: { tests: test_id } },
                    (err) => {
                        if (err) throw err;
                        resolve();
                    });


            });
    });
}

exports.updateTest = function (test_id, name, expectedResult, obtainedResult, level) {
    return new Promise(function (resolve) {
        Test.findOneAndUpdate({
                _id: test_id
            },
            {
                name: name,
                expectedResult: expectedResult,
                obtainedResult: obtainedResult,
                level: level
            },
            function (err) {
                if (err) throw err;
                resolve();
            });
    });
}