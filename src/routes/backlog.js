const Project = require('../mongoose/model/project.model');
const User = require('../mongoose/model/user.model');
const Issue = require('../mongoose/model/issue.model');

module.exports = function(app){

  app.get('/user/:login/projects/:name/backlog', async function(req, res) {
    if(typeof req.user == 'undefined' || req.params.login !== req.user.login)
    return res.send('Accès non autorisé');

    let userProjects = await User.find({login: req.params.login});
    let project;
    let projectPromise = new Promise(function(resolve, reject){
      userProjects[0].projects.forEach(async function(p){
        let tmp = await Project.findById(p);
        if(tmp.name == req.params.name)
        resolve(tmp);
      })
    });

    projectPromise.then(function(project){
      let issues = new Promise(function(resolve) {
        let res = [];
        if(typeof project.issues == 'undefined'){
          resolve(res);
        }
        if(project.issues.length == 0)
          resolve(res);
        project.issues.forEach(function(issue_id, i){
          Issue.findById(issue_id).exec().then(function(issue){
            res.push(issue);
            if(i === (project.issues.length - 1)) resolve(res);
          });
        });
      }).then(function(issues){
        return res.render('backlog', {user: req.user.login,
          project: project,
          issues: issues});
        });
      });
    });

    app.get('/user/:login/projects/:name/backlog/:id/delete', async function(req, res){
      Issue.findOneAndDelete({_id: req.params.id}, function (err) {
        if(err) console.log(err);
      });

      let userProjects = await User.find({login: req.params.login});
      let project;
      let projectPromise = new Promise(function(resolve, reject){
        userProjects[0].projects.forEach(async function(p){
          let tmp = await Project.findById(p);
          if(tmp.name == req.params.name)
          resolve(tmp);
        })
      }).then(function(project){
        project.issues.forEach(function(issue){
          //à revoir le delete d'un issue dans un projet
          Issue.findOneAndDelete({_id: req.params.id}, function (err) {
            if(err) console.log(err);
          });
        })
        return res.render('backlog', {user: req.user.login, project: project, issues: []});
      });

    });

  }
