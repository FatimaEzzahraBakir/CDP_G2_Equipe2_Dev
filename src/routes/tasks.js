const Project = require('../mongoose/model/project.model');
const User = require('../mongoose/model/user.model');
const Task = require('../mongoose/model/task.model');
const Issue = require('../mongoose/model/issue.model');
const { check, validationResult } = require('express-validator');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id/tasks', async function (req, res) {
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');
    Project.findById(req.params.project_id).then((project) => {
      Project.getTasks(project).then((tasks) => {
        res.render('tasks', {
          user: req.user.login,
          project: project,
          tasks: tasks
        });
      })
    });
  });

app.get('/user/:login/projects/:project_id/addTask', function (req, res) {
  if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
  return res.send('Accès non autorisé');
    Project.findById(req.params.project_id).then((project) => {
        res.render('addTask', { userLogin: req.params.login, project: project, error: req.flash("error") });
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
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');

    Task.findOneAndRemove(
      { _id: req.params.task_id },
      function (err, project) {
        if (err) throw err;
        res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/tasks');
      }
    );
  })
}