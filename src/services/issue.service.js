const Issue = require('../models/issue.model');
const Release = require('../models/release.model');
const Project = require('../models/project.model');
const { check, validationResult } = require('express-validator');


module.exports.validateNewIssue = function () {
  return [
    check('description').not().isEmpty(),
    check('difficulty').not().isEmpty(),
    check('state').not().isEmpty(),
    check('priority').not().isEmpty()
  ];
}

module.exports.getIssue = function (issue_id) {
  return new Promise(function (resolve) {
    Issue.findById(issue_id, (err, issue) => {
      if (err) throw err;
      resolve(issue);
    });
  });
}

module.exports.getReleasesMap = function (issues) {
  return new Promise((resolve, reject) => {
    let map = new Map();
    let promises = [];
    issues.forEach(function (issue, index, array) {
      promises.push(Release.findById(issue.release).exec());
    });
    Promise.all(promises).then((releases) => {
      releases.forEach(function (release, i) {
        if (release != null)
          map.set(issues[i].id, release.description);
      });
      resolve(map);
    });

  });
}

module.exports.createIssue = async function (issueObject) {
  return new Promise(function (resolve) {
    let issueInstance = new Issue(issueObject);
    issueInstance.save((err, issue) => {
      if (err) throw err;
      Project.findByIdAndUpdate(
        issue.project,
        { $push: { issues: issue.id } },
        (err) => {
          if (err) throw err;
          resolve();
        });
    });
  });
}

module.exports.deleteIssue = function (issue_id) {
  return new Promise(function (resolve) {
    Issue.findOneAndDelete(
      { _id: issue_id },
      (err, issue) => {
        if (err) throw err;
        Project.findByIdAndUpdate(
          issue.project,
          { $pull: { issues: issue_id } },
          (err) => {
            if (err) throw err;
            resolve();
          });
      });
  });
}

module.exports.updateIssue = function (issue_id, description, difficulty, state, priority, release_id) {
  return new Promise(function (resolve) {
    Issue.findByIdAndUpdate({
      _id: issue_id
    },
      {
        description: description,
        difficulty: difficulty,
        state: state,
        priority: priority,
        release: release_id
      },
      (err) => {
        if (err) throw err;
        resolve();
      }
    );
  });
}