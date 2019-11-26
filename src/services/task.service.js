const Task = require('../models/task.model');
const Project = require('../models/project.model');
const ProjectService = require('../services/project.service');
const User = require('../models/user.model');
const Sprint = require('../models/sprint.model');
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
      Sprint.findByIdAndUpdate(task.sprint,
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

module.exports.getSprintsMap = function (tasks) {
  return new Promise((resolve) => {
    let map = new Map();
    if (!tasks || tasks.length == 0) resolve(map);
    let promises = [];
    tasks.forEach((task) => {
      if (task)
        promises.push(Sprint.findById(task.sprint).exec());
    });
    Promise.all(promises).then((sprints) => {
      sprints.forEach(sprint => {
        if (sprint)
          map.set(sprint.id, sprint.num);
      });
      resolve(map);
    });
  });
}

module.exports.deleteTask = function (task_id) {
  return new Promise(function (resolve) {
    Task.findOneAndRemove(  //supprime la tache
      { _id: task_id },
      (err, task) => {
        if (err) throw err;
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