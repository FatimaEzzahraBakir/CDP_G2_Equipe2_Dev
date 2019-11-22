const TaskService = require('../services/task.service');
const ProjectService = require('../services/project.service');
const Task = require('../models/task.model');
const { check, validationResult } = require('express-validator');

exports.validate = () => {
  return TaskService.validateNewTask();
}

exports.TaskGetList = async function (req, res, next) {
  let tasks = await ProjectService.getTasks(res.locals.project);
  let dev_maps = await TaskService.getDevsMap(res.locals.project);
  return res.render('tasks', {
    user: req.user.login,
    project: res.locals.project,
    tasks: tasks,
    dev_maps: dev_maps
  });
}

exports.TaskAddGet = function (req, res, next) {
  return res.render('addTask', {
    userLogin: req.params.login,
    project: res.locals.project,
    error: req.flash("error")
  });
}

exports.TaskAddPost = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('addTask', {
      errors: errors.array()
    });
  }

  let project = res.locals.project;
  let taskObject = {
    project: project.id,
    description: req.body.description,
    dod: req.body.dod,
    state: req.body.state,
    length: req.body.length,
    issues: []
  };
  await TaskService.createTask(taskObject);
  return res.redirect('/user/' + req.user.login + '/projects/' + req.params.project_id + '/tasks');
}

exports.TaskDeleteGet = async function (req, res, next) {
  await TaskService.deleteTask(req.params.task_id);
  res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/tasks');
}

exports.TaskAddDevGet = async function (req, res, next) {
  let devs = await ProjectService.getMembers(res.locals.project.members);
  res.render('addDev',
    {
      user: req.user,
      project: res.locals.project,
      task: { id: req.params.task_id },
      devs: devs,
      errors: [req.flash('error')]
    });
}

exports.TaskAddDevPost = async function (req, res, next) {
  let dev_id = req.body.dev;
  if (req.body.dev == '') dev_id = undefined;
  await TaskService.assignDev(req.params.task_id, dev_id);
  return res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/tasks/');
}

exports.TaskUpdateGet = async function (req, res, next) {
  let task = await Task.findById(req.params.task_id);
  return res.render('updateTask', {
    user: req.user.login,
    project: res.locals.project,
    task: task
  });
}

exports.TaskUpdatePost = async function (req, res, next) {
  await TaskService.updateTask(req.params.task_id, req.body.description, req.body.dod, req.body.state, req.body.length);
  return res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/tasks');
}
