const Issue = require('../mongoose/model/issue.model');
const User = require('../mongoose/model/project.model');
const Task = require('../mongoose/model/task.model');
const check  = require('express-validator');

module.exports = function (app) {
    app.get('/user/:login/projects/:name/addIssue', function(req, res) {
        res.render('addIssue',{ userLogin: req.params.login, projectName: req.params.name, error: req.flash("error") });
      });

    app.post('/user/:login/projects/:name/addIssue',(req, res) => {
           let  IssueInstance = new Issue({
                description: req.body.description,
                priority: req.body.priority,
                difficulty: req.body.difficulty,
                state: req.body.state,
                projects: [],
                tasks :[]
              })
            
              IssueInstance.save()
                .then(item => {
                    res.redirect('/user/' + req.params.login + '/projects/' + project.name+'/backlog');
                })
                .catch(err => {
                    res.redirect('/user/' + req.params.login + '/projects/' + project.name+'/backlog');
                });
            });
        }