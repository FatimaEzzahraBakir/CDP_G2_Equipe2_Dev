const Issue = require('../models/issue.model');
const Project = require('../models/project.model');
const { check, validationResult } = require('express-validator');


module.exports.validateNewIssue = function () {
  return [
    check('num', 'ID invalide').not().isEmpty().isInt(),
    check('description', 'descrption invalide').not().isEmpty(),
    check('difficulty', 'difficulté invalide').not().isEmpty().isInt(),
    check('state', 'état invalide').not().isEmpty().matches(/^(TODO|DOING|DONE)$/),
    check('priority', 'priorité invalide').not().isEmpty().matches(/^(HIGH|LOW)$/)
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

module.exports.updateIssue = function (issue_id, description, difficulty, state, priority) {
  return new Promise(function (resolve) {
    Issue.findByIdAndUpdate({
      _id: issue_id
    },
      {
        description: description,
        difficulty: difficulty,
        state: state,
        priority: priority
      },
      (err) => {
        if (err) throw err;
        resolve();
      });
  });
}
