const Issue = require('../mongoose/model/issue.model');
const User = require('../mongoose/model/project.model');
const Project = require('../mongoose/model/project.model');
const check  = require('express-validator');

module.exports = function (app) {
    app.get('/user/:login/projects/:name/addIssue', function(req, res) {
        res.render('addIssue',{ userLogin: req.params.login, projectName: req.params.name, error: req.flash("error") });
      });

    app.post('/user/:login/projects/:name/addIssue',[
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
    
        let IssueInstance = new Issue({
          description: req.body.description,
          priority: req.body.priority,
          difficulty: req.body.difficulty,
          state: req.body.state,
          projects: [],
          tasks:[]
        })
    
        IssueInstance.save(function (err, issue) {
          if (err) throw err;
          issue.findOneAndUpdate(
            { login: req.params.login },
            { $push: { issues: issue.id } },
            function (err, user) {
              if (err) throw err;
              res.redirect('/user/' + req.params.login + '/projects/' + project.name+'/backlog');
            });
        });
      });
        }