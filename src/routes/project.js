const Project = require('../mongoose/model/project.model');
const User = require('../mongoose/model/user.model');

module.exports = function(app){

  app.get('/user/:login/projects/:name', async function(req, res) {
    if(typeof req.user == 'undefined' || req.params.login !== req.user.login)
    return res.send('Accès non autorisé');
    let userProjects = await User.find({login: req.params.login});
    console.log(userProjects);
    let project;
    let projectPromise = new Promise(function(resolve, reject){
      userProjects[0].projects.forEach(async function(p){
        let tmp = await Project.findById(p);
        console.log(tmp);
        if(tmp.name == req.params.name)
        resolve(tmp);
      })
    });

    projectPromise.then(function(p){
      project = p;
      console.log(project);
      //il faut aussi récuperer la liste des membres du projet
      return res.render('myProject', {user: req.user.login,
        project: project});
      });

    });
  }
