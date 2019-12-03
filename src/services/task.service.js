const Task = require('../models/task.model');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const Issue = require('../models/issue.model');
const Sprint = require('../models/sprint.model');
const IssueService = require('../services/issue.service');
const { check, validationResult } = require('express-validator');

module.exports.validateNewTask = function () {
  return [
    check('num', 'ID invalide').not().isEmpty().isInt().custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Task.findOne({
          num: req.body.num,
          project: req.params.project_id
        },
          function (err, task) { //ID unique dans le projet
            if (err) {
              reject(new Error('Erreur Serveur'))
            }
            if (Boolean(task)) {
              reject(new Error('ID déjà utilisé'))
            }
            resolve(true)
          });
      });
    }),
    check('description', 'description requise').not().isEmpty(),
    check('dod', 'def of done requise').not().isEmpty(),
    check('state', 'état requis').not().isEmpty(),
    check('length', 'difficulté requise').not().isEmpty()
  ];
}

module.exports.getTask = function (task_id) {
  return new Promise(function (resolve) {
    Task.findById(resq.params.task_id).then((err, task) => {
      if (err) throw err;
      resolve(task);
    })
  });
}

module.exports.createTask = function (taskObject) {
  return new Promise(function (resolve) {
    let taskInstance = new Task(taskObject);
    taskInstance.save(function (err, task) {

      if (err) throw err;
      Sprint.findByIdAndUpdate(task.sprint,
        { $push: { tasks: task.id } },
        (err) => {
          if (err) throw err;
        }
      );
      Issue.updateMany(
        { _id: task.issues },
        { $push: { tasks: task.id } },
        (err) => {
          if (err) throw err;
          //update les states des issues assignées
          task.issues.forEach(task_issue => { 
            IssueService.updateIssueState(task_issue);
          });
        }
      );
      Project.findOneAndUpdate(
        { _id: task.project },
        { $push: { tasks: task.id } },
        (err) => {
          if (err) throw err;
          resolve();
        }
      );
    });
  });
}

module.exports.deleteTask = function (task_id) {
  return new Promise(function (resolve) {
    Task.findOneAndRemove(  //supprime la tache
      { _id: task_id },
      (err, task) => {
        if (err) throw err;
        Issue.updateMany( //enlève la tache aux issues
          { _id: task.issues },
          { $pull: { tasks: task_id } },
          (err) => {
            if (err) throw err;
            //update les états des issues
            task.issues.forEach(task_issue_id => {
              IssueService.updateIssueState(task_issue_id);
            });
          });
        Sprint.findByIdAndUpdate(task.sprint, //enleve la tache au sprint
          { $pull: { tasks: task_id } },
          (err) => {
            if (err) throw err;
            Project.findByIdAndUpdate(task.project, //enleve la tache au projet
              { $pull: { tasks: task_id } },
              (err) => {
                if (err) throw err;
                User.findByIdAndUpdate(task.dev,  //enleve la tache au dev
                  { $pull: { tasks: task_id } },
                  (err) => {
                    if (err) throw err;
                    resolve();
                  });
              });
          });
      });
  });
}

module.exports.assignDev = function (task_id, dev_id) {
  return new Promise(function (resolve) {
    //enlever la task à l'ancien dev
    User.findOneAndUpdate({ tasks: task_id }, { $pull: { tasks: task_id } });

    //ajouter dev à task
    Task.findByIdAndUpdate(
      task_id,
      { dev: dev_id },
      (err) => {
        if (err) throw err;
        if (dev_id == '')
          resolve();

        //ajouter task a dev
        User.findOneAndUpdate(
          { _id: dev_id },
          { $addToSet: { tasks: task_id } },
          (err) => {
            if (err) throw err;
            resolve();
          }
        );
      });
  });
}

module.exports.updateTask = function (task_id, newTask) {
  return new Promise(function (resolve) {
    
    let old_issues;
    Issue.find({tasks: task_id},
      function(err, docs) {
        old_issues = docs;
      }
    ); /*

    if(newTask.issues && !Array.isArray(newTask.issues))
      newTask.issues = [newTask.issues]; */

    Task.findByIdAndUpdate(task_id, {
      description: newTask.description,
      dod: newTask.dod,
      state: newTask.state,
      length: newTask.length,
      sprint: newTask.sprint/*,
      issues: newTask.issues*/
    },
      function (err) {
        if (err) throw err;
        Sprint.updateMany(
          { tasks: task_id },
          { $pull: { tasks: task_id } },
          err => {
            if (err) throw err;
            Sprint.findByIdAndUpdate(
              {_id: newTask.sprint},
              { $addToSet: { tasks: task_id } },
              err => {
                if(err) throw err;
                old_issues.forEach(old_isssue => {
                  IssueService.updateIssueState(old_isssue._id);
                });// à supprimer si on décommente le reste
                resolve();
              }
            );
          });/*
        Issue.updateMany(
          { tasks: task_id },
          { $pull: { tasks: task_id } },
          err => {
            if (err) throw err;
            old_issues.forEach(old_isssue => {
              IssueService.updateIssueState(old_isssue._id);
            });
            if(newTask.issues) {
              Issue.updateMany(
                { _id: newTask.issues },
                { $addToSet: { tasks: task_id } },
                err => { 
                  if (err) throw err; 
                  newTask.issues.forEach( new_issue => {
                    IssueService.updateIssueState(new_issue);
                  });
                }
              );
            }
          });*/
       // resolve();
      });
  });
}

module.exports.getTasksByIssue = function (issue) {
  return new Promise(function(resolve) {
    let promises = [];
    issue.tasks.forEach(task_id => {
      promises.push(Task.findById(task_id).exec());
    })
    Promise.all(promises).then( tasks => {
      resolve(tasks);
    });
  });
}