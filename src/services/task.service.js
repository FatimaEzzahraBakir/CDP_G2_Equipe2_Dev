const Task = require('../models/task.model');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const Issue = require('../models/issue.model');
const Sprint = require('../models/sprint.model');
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

module.exports.updateTask = function (task_id, description, dod, state, length, issues, sprint) {
  return new Promise(function (resolve) {
    Task.findByIdAndUpdate(task_id, {
      description: description,
      dod: dod,
      state: state,
      length: length,
      sprint: sprint,
      issues: issues
    },
      function (err) {
        if (err) throw err;
        Sprint.updateMany(
          { tasks: task_id },
          { $pull: { tasks: task_id } },
          err => {
            if (err) throw err;
            Sprint.findByIdAndUpdate(
              {_id: sprint},
              { $addToSet: { tasks: task_id } },
              err => {
                if(err) throw err;
              }
            );
          });
        Issue.updateMany(
          { tasks: task_id },
          { $pull: { tasks: task_id } },
          err => {
            if (err) throw err;
            Issue.updateMany(
              { _id: issues },
              { $addToSet: { tasks: task_id } },
              (err => { if (err) throw err; })
            )
          });
        resolve();
      });
  });
}