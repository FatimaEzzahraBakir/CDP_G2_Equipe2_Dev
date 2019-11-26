const SprintService = require('../services/sprint.service');
const { check, validationResult } = require('express-validator');

exports.validate = function () {
  return SprintService.validateNewSprint();
}

exports.SprintNewGet = function (req, res, next) {
  res.render('newSprint', {
    user: req.user,
    project: res.locals.project,
    errors: [req.flash('error')]
  });
}

exports.SprintNewPost = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('newSprint', {
      user: req.user,
      project: res.locals.project,
      errors: errors.array()
    });
  }
  let sprintObject = {
    num: req.body.num,
    description: req.body.description,
    startDate: Date.parse(req.body.startDate),
    endDate: Date.parse(req.body.endDate),
    tasks: [],
    features: '',
    project: req.params.project_id
  };
  await SprintService.createSprint(sprintObject);
  res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/sprints');

}

exports.SprintsGet = async function (req, res, next) {
  let sprints = await SprintService.getSprintsFromProject(req.params.project_id);
  let tasks_map = await SprintService.getTasksMap(sprints);
  return res.render('sprints', { user: req.user, project: res.locals.project, sprints: sprints, tasks_map: tasks_map });
}

exports.SprintDeleteGet = async function (req, res, next) {
  await SprintService.deleteSprint(req.params.sprint_id);
  res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/sprints');
}

exports.SprintUpdateGet = async function (req, res, next) {
  let sprint = await SprintService.getSprint(req.params.sprint_id);
  return res.render('updateSprint', {
    user: req.user,
    project: res.locals.project,
    sprint: req.params.sprint_id
  });
}

exports.SprintUpdatePost = async function (req, res, next) {
  await SprintService.updateSprint(req.params.sprint_id, req.body.date, req.body.description);
  res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + "/sprints");
}