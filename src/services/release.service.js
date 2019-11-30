const Release = require('../models/release.model');
const { check, validationResult } = require('express-validator');

module.exports.validateNewRelease = function () {
  return [
    check('version').not().isEmpty().withMessage('Version Requise'),
    check('releaseDate').not().isEmpty().withMessage('Date de release requise').custom((value) => {
      return new Promise((resolve, reject) => {
        if (!isNaN(Date.parse(value)))
          resolve(true);
        else
          reject(new Error("Format de date attendu : yyyy/mm/dd"));
      });
    }),
    check('description').not().isEmpty().withMessage('description attendue')
  ];
}

module.exports.getReleasesFromProject = function (project){
  return new Promise(function(resolve) {
    Release.find({project: project._id},
      (err, releases) => {
        if(err) throw err;
        resolve(releases);
      });
  });
}

module.exports.createRelease = function(releaseObject) {
  return new Promise(function(resolve) {
    let releaseInstance = Release(releaseObject);
    releaseInstance.save(function(err) {
      if(err) throw err;
      resolve();
    });
  });
}

module.exports.deleteRelease = function(release_id) {
  return new Promise(function(resolve) {
    Release.findByIdAndDelete(release_id,
      (err) => {
        if(err) throw err;
        resolve();
      });
  });
}