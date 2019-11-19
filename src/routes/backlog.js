const Project = require('../mongoose/model/project.model');
const User = require('../mongoose/model/user.model');
const Issue = require('../mongoose/model/issue.model');
const Release = require('../mongoose/model/release.model');
const { check, validationResult } = require('express-validator');

module.exports = function (app) {

  function getReleasesMap(issues) {
    return new Promise((resolve, reject) => {
      let map = new Map();

      issues.forEach(function(issue, index, array) {
        Release.findById(issue.release).then((release) => {
          if(release != null){
            map.set(issue.id, release.description);
          }
          if(index == issues.length-1){
            resolve(map);
          }
        });
      });
    });
  };

  app.get('/user/:login/projects/:project_id/backlog', async function (req, res) {
    Project.findById(req.params.project_id).then((project) => {
      Project.getIssues(project).then((issues) => {
        getReleasesMap(issues).then((sprint_map) => {
          console.log(sprint_map);
          if(sprint_map != null){
            res.render('backlog', {
              user: req.user.login,
              project: project,
              issues: issues,
              sprints: sprint_map
            });
          }
          else{
            res.render('backlog', {
              user: req.user.login,
              project: project,
              issues: issues
            });
          }
        });
      })
    });
  });

  app.get('/user/:login/projects/:project_id/backlog/:id/delete', function (req, res) {
    Issue.findOneAndDelete({ _id: req.params.id }, async function (err) {
      if (err) console.log(err);
      let userProjects = await User.find({ login: req.params.login });
      //On recupere le projet
      let projectPromise = new Promise(function (resolve, reject) {
        userProjects[0].projects.forEach(async function (p) {
          let tmp = await Project.findById(p);
          if (tmp.id == req.params.project_id)
          resolve(tmp);
        })
      }).then(function (project) {
        if (err) throw err;
        //On recupere les issues du projet
        let issues = new Promise(function (resolve) {
          let res = [];
          if (typeof project.issues == 'undefined') {
            resolve(res);
          }
          if (project.issues.length == 0)
          resolve(res);
          project.issues.forEach(function (issue_id, i) {
            Issue.findById(issue_id).exec().then(function (issue) {
              res.push(issue);
              if (i === (project.issues.length - 1)) resolve(res);
            });
          });
        }).then(function (issues) {
          //ne marche pas encore : ne fait rien
          Project.update(
            { _id: project._id },
            { $pull: { 'issues': req.params.id } }, function (err, result) {
              //return res.render('backlog', {user: req.user.login, project: project, issues: issues});
              res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/backlog');
            }
          );
        })
      });
    });
  });

  app.get('/user/:login/projects/:project_id/backlog/:id/update', async function (req, res) {
    Project.findById(req.params.project_id).then((project) => {
      Issue.findById(req.params.id).then((issue) => {
        Release.find({project: req.params.project_id}).then((releases) => {
          return res.render('updateIssue', { user: req.user.login, project: project, issue: issue, sprints: releases });
        })
      });
    });
  });

  app.post('/user/:login/projects/:project_id/backlog/:id/update', async function (req, res) {
    Release.find({description: req.body.sprint}).then((release) => {
      Issue.findOneAndUpdate({
        _id: req.params.id
      },
      {
        description: req.body.description,
        difficulty: req.body.difficulty,
        state: req.body.state,
        priority: req.body.priority,
        release: release[0].id
      },
      function (err, project) {
        if (err) throw err;
        Release.findOneAndUpdate({_id: release[0].id, issues: { $ne: req.params.id }},
          {$push: { issues:  req.params.id }}, function(err, releas){
          res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/backlog');
        });
      });
    })
  });

  app.get('/user/:login/projects/:project_id/addIssue', function (req, res) {
    Project.findById(req.params.project_id).then((project) => {
      res.render('addIssue', { userLogin: req.params.login, project: project, error: req.flash("error") });
    });
  });

  app.post('/user/:login/projects/:project_id/addIssue', [
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
      _id: req.params.project_id,
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
      issueInstance.project = project.id;
      issueInstance.save(function (err, issue) {
        if (err) throw err;
        Project.findOneAndUpdate(
          {
            _id: req.params.project_id,
            members: req.user.id
          },
          {
            $push: { issues: issue.id }
          },
          function (err) {
            if (err) throw err;
            return res.redirect('/user/' + req.user.login + '/projects/' + req.params.project_id + '/backlog');
          }
        )
      })
    }
  );
});
}
