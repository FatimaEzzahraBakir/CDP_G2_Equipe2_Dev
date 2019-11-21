const Task = require('../models/task.model');
const Project = require('../models/project.model');
const ProjectService = require('../services/project.service');
const User = require('../models/user.model');
const { check, validationResult } = require('express-validator');

module.exports.validateNewTask = function () {
  return [
    check('description').not().isEmpty(),
    check('dod').not().isEmpty(),
    check('state').not().isEmpty(),
    check('length').not().isEmpty()
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

module.exports.getDevsMap = function (project) {
  return new Promise((resolve) => {
    let map = new Map();
    ProjectService.getMembers(project.members).then((members) => {
      if (members.length == 0) resolve(map);
      members.forEach(member => {
        map.set(member.id, member.login);
      });
      resolve(map);
    });
  });
}

module.exports.deleteTask = function (task_id) {
  return new Promise(function (resolve) {
    Task.findOneAndRemove(
      { _id: task_id },
      (err) => {
        if (err) throw err;
        resolve();
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

module.exports.updateTask = function (task_id, description, dod, state, length) {
  return new Promise(function (resolve) {
    Task.findByIdAndUpdate(task_id, {
      description: description,
      dod: dod,
      state: state,
      length: length
    },
      function (err) {
        if (err) throw err;
        resolve();
      });
  });
}