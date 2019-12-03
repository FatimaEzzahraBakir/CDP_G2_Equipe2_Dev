const Sprint = require('../models/sprint.model');
const Task = require('../models/task.model');
const TaskService = require('../services/task.service');
const Issue = require('../models/issue.model');
const { check, validationResult } = require('express-validator');

module.exports.validateNewSprint = function () {
  return [
    check('num').not().isEmpty().isInt().custom((value, { req }) => {
      return new Promise((resolve, reject) => {
        Sprint.findOne({
          num: req.body.num,
          project: req.params.project_id
        },
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
        if (err) throw err;
        Issue.update({ sprint: sprint_id },
          { sprint: undefined },
          (err) => {
            //delete toutes les tâches du sprint
            if (err) throw err;
            let promises = []
            sprint.tasks.forEach(task_id => {
              promises.push(TaskService.deleteTask(task_id));
            });
            Promise.all(promises).then(
              () => {
                resolve();
              });
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

module.exports.moveIncompleteTasksAndIssues = function (from_sprint_id, to_sprint_id) {
  return new Promise(function (resolve) {
    let issues_moved, tasks_moved;

    Task.find(
      {
        sprint: from_sprint_id,
        state: { $not: /DONE/ },
      }, (err, tasks) => {
        if (err) throw err;
        tasks_moved = tasks.map(tasks => tasks._id);

        Task.updateMany(
          { _id: { $in: tasks_moved } },
          { sprint: to_sprint_id },
          err => {
            if (err) throw err;

            Issue.find(
              {
                sprint: from_sprint_id,
                state: { $not: /DONE/ },
              }, (err, issues) => {
                if (err) throw err;
                issues_moved = issues.map(issue => issue._id);

                Issue.updateMany(
                  { _id: { $in: issues_moved } },
                  { sprint: to_sprint_id },
                  err => {
                    if (err) throw err;

                    Sprint.findByIdAndUpdate(
                      from_sprint_id,
                      {
                        $pullAll:
                          { tasks: tasks_moved }
                      }, (err) => {
                        if (err) throw err;
                        Sprint.findByIdAndUpdate(
                          from_sprint_id,
                          {
                            $pullAll: { issues: issues_moved }
                          },
                          (err) => {
                            if (err) throw err;
                            Sprint.findByIdAndUpdate(
                              to_sprint_id,
                              {
                                $push:
                                  { tasks: { $each: tasks_moved } }
                              },
                              (err) => {
                                if (err) throw err;
                                Sprint.findByIdAndUpdate(
                                  to_sprint_id,
                                  {
                                    $push: { issues: { $each: issues_moved } }
                                  },
                                  err => {
                                    if (err) throw err;
                                    resolve();
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
}

module.exports.getTodaySprints = function (sprints) {
  return new Promise(function (resolve) {
    let today = Date.now();
    let promises = [];
    sprints.forEach(sprint => {
      if (sprint.startDate <= today && sprint.endDate >= today) {
        promises.push(sprint);
      }
    });
    Promise.all(promises).then(values => {
      resolve(values);
    });
  });
}
