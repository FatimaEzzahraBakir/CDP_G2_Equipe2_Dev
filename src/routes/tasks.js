const Project = require('../mongoose/model/project.model');
const User = require('../mongoose/model/user.model');
const Task = require('../mongoose/model/task.model');
const Issue = require('../mongoose/model/issue.model');
const { check, validationResult } = require('express-validator');

module.exports = function (app) {

  function getDevsMap(project) {
    return new Promise((resolve, reject) => {
      let map = new Map();
      Project.getMembers(project).then((members) => {
        if (members.length == 0) resolve(map);
        members.forEach(member => {
          map.set(member.id, member.login);
        });
        resolve(map);
      });
    });
  };

  app.get('/user/:login/projects/:project_id/tasks', async function (req, res) {
    Project.getTasks(res.locals.project).then((tasks) => {
      getDevsMap(res.locals.project).then((dev_maps) => {
        res.render('tasks', {
          user: req.user.login,
          project: res.locals.project,
          tasks: tasks,
          dev_maps: dev_maps
        });
      });
    });
  });

  app.get('/user/:login/projects/:project_id/addTask', function (req, res) {
    Project.findById(req.params.project_id).then((project) => {
      res.render('addTask', {
        userLogin: req.params.login,
        project: res.locals.project,
        error: req.flash("error")
      });
    });
  });

  app.post('/user/:login/projects/:project_id/addTask', [
    check('description').not().isEmpty(),
    check('dod').not().isEmpty(),
    check('state').not().isEmpty(),
    check('length').not().isEmpty()
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('addTask', {
        errors: errors.array()
      });
    }

    Project.findOne({
      _id: req.params.project_id,
      members: req.user.id
    }, function (err, project) {
      if (err) throw err;
      let TaskInstance = new Task({
        description: req.body.description,
        dod: req.body.dod,
        state: req.body.state,
        length: req.body.length,
        issues: []
      });
      TaskInstance.project = project.id;
      TaskInstance.save(function (err, task) {
        if (err) throw err;
        Project.findOneAndUpdate(
          {
            _id: req.params.project_id,
            members: req.user.id
          },
          {
            $push: { tasks: task.id }
          },
          function (err) {
            if (err) throw err;
            return res.redirect('/user/' + req.user.login + '/projects/' + req.params.project_id + '/tasks');
          }
        )
      })
    }
    );
  });

  app.get('/user/:login/projects/:project_id/tasks/:task_id/delete', function (req, res) {
    Task.findOneAndRemove(
      { _id: req.params.task_id },
      function (err, project) {
        if (err) throw err;
        res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/tasks');
      }
    );
  });

  app.get('/user/:login/projects/:project_id/tasks/:task_id/addDev', function (req, res) {
    Project.getMembers(project).then((devs) => {
      res.render('addDev',
        {
          user: req.user,
          project: res.locals.project,
          task: { id: req.params.task_id },
          devs: devs,
          errors: [req.flash('error')]
        }
      );
    });
  });

  app.post('/user/:login/projects/:project_id/tasks/:task_id/addDev', function (req, res) {
    //enlever la task à l'ancien dev
    User.findOneAndUpdate({ tasks: req.params.task_id }, { $pull: { tasks: req.params.task_id } });
    let taskQuery = { dev: req.body.dev };
    if (req.body.dev == '') taskQuery = { dev: undefined };

    //ajouter dev à task
    Task.findByIdAndUpdate(
      req.params.task_id,
      taskQuery,
      (err, task) => {
        if (err) throw err;
        if (req.body.dev == '')
          return res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/tasks/');

        //ajouter task a dev
        User.findOneAndUpdate(
          { _id: req.body.dev },
          { $addToSet: { tasks: req.params.task_id } },
          (err, user) => {
            if (err) throw err;
            res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/tasks/');
          }
        );
      });
  });

  app.get('/user/:login/projects/:project_id/tasks/:task_id/updateTask', async function (req, res) {
    Task.findById(req.params.task_id).then((task) => {
      return res.render('updateTask', { 
        user: req.user.login, 
        project: res.locals.project, 
        task: task });
    });
  });
  app.post('/user/:login/projects/:project_id/tasks/:task_id/updateTask', async function (req, res) {
    Task.findOneAndUpdate({
      _id: req.params.task_id,
    },
      {
        description: req.body.description,
        dod: req.body.dod,
        state: req.body.state,
        length: req.body.length
      },
      function (err, project) {
        if (err) throw err;
        res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/tasks');
      });

  });
}