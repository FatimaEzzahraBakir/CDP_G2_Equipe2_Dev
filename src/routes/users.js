const User = require('../mongoose/model/user.model');
const Project = require('../mongoose/model/project.model');
const { check, validationResult } = require('express-validator');


module.exports = function (app) {

  app.get('/user/:login/projects', function (req, res) {
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');

    User.getProjects(req.user).then(function (user_projects) {
      res.render('projects', {
        user: req.user.login,
        projects: user_projects
      });
    });

  });

  app.get('/user/:login/newProject', function (req, res) {
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');
    res.render('newProject', { user: req.user.login });
  });

  app.post('/user/:login/newProject', [
    check('name').not().isEmpty(),
    check('description').not().isEmpty()
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('newProject', {
        errors: errors.array()
      });
    }

    let projectInstance = new Project({
      name: req.body.name,
      description: req.body.description,
      members: [req.user.id]
    })

    projectInstance.save(function (err, project) {
      if (err) throw err;
      User.findOneAndUpdate(
        { login: req.params.login },
        { $push: { projects: project.id } },
        function (err, user) {
          if (err) throw err;
          res.redirect('/user/' + user.login + '/projects');
        });
    });
  });

}