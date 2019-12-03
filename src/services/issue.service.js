const Issue = require('../models/issue.model');
const Project = require('../models/project.model');
const Sprint = require('../models/sprint.model');
const Release = require('../models/release.model');
const Task = require('../models/task.model');
const TaskService = require('../services/task.service');
const { check, validationResult } = require('express-validator');


module.exports.validateNewIssue = function () {
  return [
    check('num', 'ID invalide').not().isEmpty().isInt().custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Issue.findOne({
          num: req.body.num,
          project: req.params.project_id
        },
          function (err, issue) { //ID unique dans le projet
            if (err) {
              reject(new Error('Erreur Serveur'))
            }
            if (Boolean(issue)) {
              reject(new Error('ID déjà utilisé'))
            }
            resolve(true)
          });
      });
    }),
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

module.exports.createIssue = function (issueObject) {
  return new Promise(function (resolve) {
    let issueInstance = new Issue(issueObject);
    issueInstance.save((err, issue) => {
      if (err) throw err;
      Sprint.findByIdAndUpdate(
        issue.sprint,
        { $push: { issues: issue.id } },
        (err) => {
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
  });
}

module.exports.deleteIssue = function (issue_id) {
  return new Promise(function (resolve) {
    Issue.findOneAndDelete(
      { _id: issue_id },
      (err, issue) => {
        if (err) throw err;
        //on l'enlève dans les releases
        Release.updateMany({issues: issue_id},
          { $pull: { issues: issue_id } },
          (err) => {
            if(err) throw err;
          });
          //on l'enlève dans les tasks
        Task.updateMany({issues: issue_id},
          { $pull: { issues: issue_id } },
          (err) => {
            if(err) throw err;
          });
          //on l'enlève dans les sprints
        Sprint.findByIdAndUpdate(
          issue.sprint,
          { $pull: { issues: issue_id } },
          (err) => {
            if (err) throw err;
            //on l'enlève dans le projet
            Project.findByIdAndUpdate(
              issue.project,
              { $pull: { issues: issue_id } },
              (err) => {
                if (err) throw err;
                resolve();
              });
          });

      });
  });
}

module.exports.updateIssueState = function (issue_id) {
  return new Promise(function (resolve) {
    Issue.findById(issue_id,
      (err, issue) => {
        if (err) throw err;
        let number_of_tasks = issue.tasks.length;
        if (number_of_tasks === 0)
          resolve();
        TaskService.getTasksByIssue(issue).then(tasks => {
          let todo_tasks = tasks.filter(task => task.state === 'TODO');
          let done_tasks = tasks.filter(task => task.state === 'DONE');
          let new_state = 'DOING';
          if(issue.tasks && issue.tasks.length > 0){
            if (todo_tasks.length === issue.tasks.length)
              new_state = 'TODO';
            else if (done_tasks.length === issue.tasks.length)
              new_state = 'DONE';
          }
          else{
            new_state = 'TODO';
          }

          Issue.findByIdAndUpdate(
            issue_id,
            { state: new_state },
            (err) => {
              if (err) throw err;
              resolve();
            });
        });
      });
  });
}

module.exports.updateIssue = function (issue_id, description, difficulty, priority, sprint) {
  return new Promise(function (resolve) {
    let old_sprint;
    Sprint.findOne({issues: issue_id}, { $pull : { issues : issue_id }}, (err, foundsprint) => {
      old_sprint = foundsprint;
    });
    Issue.findByIdAndUpdate({
      _id: issue_id
    },
      {
        description: description,
        difficulty: difficulty,
        priority: priority,
        sprint: sprint
      },
      (err) => {
        if (err) throw err;
        if(old_sprint) {
          Sprint.findByIdAndUpdate(old_sprint._id,
            { $pull : { issues : issue_id }},
            err => {
              if (err) throw err;
            });
        }
        Sprint.findByIdAndUpdate(sprint,
          { $addToSet : { issues: issue_id }},
          err => {
            if(err) throw err;
            resolve();
          });
      });
  });
}
