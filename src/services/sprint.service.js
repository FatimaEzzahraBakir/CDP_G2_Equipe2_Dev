const Sprint = require('../models/sprint.model');
const Task = require('../models/task.model');
const { check, validationResult } = require('express-validator');

module.exports.validateNewSprint = function () {
  return [
    check('num').not().isEmpty().isInt().custom((value, {req} ) => {
      return new Promise((resolve, reject) => {
        Sprint.findOne({ num: req.body.num,
                        project: req.params.project_id },
                        function (err, sprint) { //ID unique dans le projet
          if (err) {
            reject(new Error('Erreur Serveur'))
          }
          if (Boolean(sprint)) {
            reject(new Error('ID déjà utilisé'))
          }
          resolve(true)
        });
      });
    }),
    check('startDate').not().isEmpty().withMessage('Date de début requise').custom((value) => {
      return new Promise((resolve, reject) => {
        if (!isNaN(Date.parse(value)))
          resolve(true);
        else
          reject(new Error("Format de date attendu : yyyy/mm/dd"));
      });
    }),
    check('endDate').not().isEmpty().withMessage('Date de fin requise').custom((value) => {
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

module.exports.getSprint = function (sprint_id) {
  return new Promise(function (resolve) {
    Sprint.findById(sprint_id, (err, sprint) => {
      if (err) throw err;
      resolve(sprint);
    })
  });
}

module.exports.getSprintFromDescription = function (description) {
  return new Promise(function (resolve) {
    Sprint.findOne({ description: description },
      (err, sprint) => {
        if (err) throw err;
        resolve(sprint);
      });
  });
}

module.exports.getSprintsFromProject = function (project_id) {
  return new Promise(function (resolve) {
    Sprint.find({ project: project_id }, (err, sprints) => {
      if (err) throw err;
      resolve(sprints);
    });
  });
}


module.exports.getTasks = function (sprint) {
  return new Promise(function (resolve) {
    let res = [];
    if (typeof sprint.tasks == 'undefined' || sprint.tasks.length === 0) {
      resolve(res);
    }
    let promises = [];
    sprint.tasks.forEach(task_id => {
      promises.push(Task.findById(task_id).exec());
    });
    Promise.all(promises).then(values => {
      resolve(values);
    });
  });
}

module.exports.getTasksMap = function (sprints) {
  return new Promise((resolve, reject) => {
    let map = new Map();
    let promises = [];
    if (!sprints || sprints.length === 0) resolve(map);
    sprints.forEach(function (sprint) {
      promises.push(exports.getTasks(sprint));
    });
    Promise.all(promises).then(array_of_tasks => {
      array_of_tasks.forEach(tasks => {
        if (tasks.length == 0) resolve(map);
        tasks.forEach(task => {
          if (task != null) {
            map.set(task.id, task.num);
          }
        });
      });
      resolve(map);
    });
  });
}

module.exports.createSprint = function (sprintObject) {
  return new Promise(function (resolve) {
    let sprintInstance = new Sprint(sprintObject);
    sprintInstance.save((err) => {
      if (err) throw err;
      resolve();
    });
  });
}

module.exports.deleteSprint = function (sprint_id) {
  return new Promise(function (resolve) {
    Sprint.findByIdAndDelete(sprint_id,
      (err, sprint) => {
        Task.update({ sprint: sprint.id },
          { sprint: undefined },
          (err) => {
            if (err) throw err;
            resolve();
          });
      });
  });
}

module.exports.updateSprint = function (sprint_id, startDate, endDate, description) {
  return new Promise(function (resolve) {
    Sprint.findByIdAndUpdate(sprint_id,
      {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description: description
      },
      function (err) {
        if (err) throw err;
        resolve();
      })
  });
}
