const Project = require('../mongoose/model/project.model');
const User = require('../mongoose/model/user.model');

module.exports = function(app){

  app.get('/user/:login/projects/:name', async function(req, res) {
    if(typeof req.user == 'undefined' || req.params.login !== req.user.login)
    return res.send('Accès non autorisé');
    /// fonctionnement à vérifier
    let userProjects = await User.find({login: req.params.login});
    let project;
    let projectPromise = new Promise(function(resolve, reject){
      userProjects[0].projects.forEach(async function(p){
        let tmp = await Project.findById(p);
        if(tmp.name == req.params.name)
        resolve(tmp);
      })
    });

    projectPromise.then(function(p){
      project = p;

      let members = new Promise(function(resolve) {
        let res = [];
        if(typeof project.members == 'undefined'){
          resolve(res);
        }
        project.members.forEach(function(user_id, i){
          User.findById(user_id).exec().then(function(user){
            res.push(user);
            if(i === (project.members.length - 1)) resolve(res);
          });
        });
      }).then(function(mem){
        return res.render('myProject', {user: req.user.login,
          project: project,
        members: mem});
        });


      });

    });
  }
