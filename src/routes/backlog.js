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

    app.get('/user/:login/projects/:name/backlog/:id/delete', function(req, res){
      Issue.findOneAndDelete({_id: req.params.id}, async function (err) {
        if(err) console.log(err);
        let userProjects = await User.find({login: req.params.login});
        let project;
        //On recupere le projet
        let projectPromise = new Promise(function(resolve, reject){
          userProjects[0].projects.forEach(async function(p){
            let tmp = await Project.findById(p);
            if(tmp.name == req.params.name)
            resolve(tmp);
          })
        }).then(function(project){
          if (err) throw err;
          //On recupere les issues du projet
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
            //ne marche pas encore : ne fait rien
            Project.update(
              { _id: project._id },
              { $pull: { 'issues': req.params.id } }, function(err, result){
                //return res.render('backlog', {user: req.user.login, project: project, issues: issues});
                res.redirect('/user/' + req.params.login +'/projects/' + req.params.name + '/backlog');
              }
            );
          })
        });
      });
    });

    app.get('/user/:login/projects/:name/backlog/:id/update', async function(req, res) {
      if(typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');
      let issue = await Issue.findById(req.params.id);
      return res.render('updateIssue', {user: req.user.login, projectName: req.params.name,issue: issue});
    });

    app.post('/user/:login/projects/:name/backlog/:id/update', async function(req, res) {
      if(typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');

      Issue.findOneAndUpdate({
        _id: req.params.id,
      },
      {
        description: req.body.description,
        difficulty: req.body.difficulty,
        state: req.body.state,
        priority: req.body.priority
      },
      function (err, project) {
        if (err) throw err;
        res.redirect('/user/' + req.params.login + '/projects/' + req.params.name + '/backlog');
      });

    });


  }
