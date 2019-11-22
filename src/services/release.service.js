const Release = require('../models/release.model');
const Issue = require('../models/issue.model');
const { check, validationResult } = require('express-validator');

module.exports.validateNewRelease = function () {
  return [
    check('date').not().isEmpty().withMessage('Date requise').custom((value) => {
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

module.exports.getRelease = function (release_id) {
  return new Promise(function (resolve) {
    Release.findById(release_id, (err, release) => {
      if (err) throw err;
      resolve(release);
    })
  });
}

module.exports.getReleaseFromDescription = function (description) {
  return new Promise(function (resolve) {
    Release.findOne({ description: description },
      (err, release) => {
        if (err) throw err;
        resolve(release);
      });
  });
}

module.exports.getReleasesFromProject = function (project_id) {
  return new Promise(function (resolve) {
    Release.find({ project: project_id }, (err, releases) => {
      if (err) throw err;
      resolve(releases);
    });
  });
}


module.exports.getIssues = function (sprint) {
  return new Promise(function (resolve) {
    let res = [];
    if (typeof sprint.issues == 'undefined' || sprint.issues.length === 0) {
      resolve(res);
    }
    let promises = [];
    sprint.issues.forEach(issue_id => {
      promises.push(Issue.findById(issue_id).exec());
    });
    Promise.all(promises).then(values => {
      resolve(values);
    });
  });
}

module.exports.getIssuesMap = function (releases) {
  return new Promise((resolve, reject) => {
    let map = new Map();
    if (!releases) resolve(map);
    releases.forEach(function (release) {
      exports.getIssues(release).then((issues) => {
        if (issues.length == 0) resolve(map);
        issues.forEach(issue => {
          if (issue != null) {
            map.set(issue.id, issue.description);
          }
        });
        resolve(map);
      });
    });
  });
}

module.exports.createRelease = function (releaseObject) {
  return new Promise(function (resolve) {
    let releaseInstance = new Release(releaseObject);
    releaseInstance.save((err) => {
      if (err) throw err;
      resolve();
    });
  });
}

module.exports.deleteRelease = function (release_id) {
  return new Promise(function (resolve) {
    Release.findByIdAndDelete(release_id,
      (err) => {
        if (err) throw err;
        resolve();
      });
  });
}

module.exports.updateRelease = function (release_id, date, description) {
  return new Promise(function (resolve) {
    Release.findByIdAndUpdate(release_id,
      {
        releaseDate: new Date(date),
        description: description
      },
      function (err) {
        if (err) throw err;
        resolve();
      })
  });
}
