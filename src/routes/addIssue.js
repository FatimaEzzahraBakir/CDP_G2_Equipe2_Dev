const Issue = require('../mongoose/model/issue.model');
const Project = require('../mongoose/model/project.model');
const { check, validationResult } = require('express-validator');

module.exports = function (app) {
  app.get('/user/:login/projects/:name/addIssue', function (req, res) {
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');
    res.render('addIssue', { userLogin: req.params.login, projectName: req.params.name, error: req.flash("error") });
  });

  app.post('/user/:login/projects/:name/addIssue', [
    check('description').not().isEmpty(),
    check('difficulty').not().isEmpty(),
    check('state').not().isEmpty(),
    check('priority').not().isEmpty()
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('addIssue', {
        errors: errors.array()
      });
    }

    Project.findOne({
      name: req.params.name,
      members: req.user.id
    }, function (err, project) {
      if (err) throw err;
      let issueInstance = new Issue({
        description: req.body.description,
        priority: req.body.priority,
        difficulty: req.body.difficulty,
        state: req.body.state,
        tasks: []
      });
      issueInstance.projects = project.id;
      issueInstance.save(function (err, issue) {
        if (err) throw err;
        Project.findOneAndUpdate(
          {
            name: req.params.name,
            members: req.user.id
          },
          {
            $push: { issues: issue.id }
          },
          function (err) {
            if (err) throw err;
            return res.redirect('/user/' + req.user.login + '/projects/' + req.params.name + '/backlog');
          }
        )
      })
    }
    );
  });
}