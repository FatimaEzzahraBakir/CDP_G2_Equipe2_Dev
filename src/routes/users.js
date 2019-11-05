const Project = require('../mongoose/model/project.model');

module.exports = function(app){

  app.get('/user/:login/projects', function(req, res) {
    if(typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');
      return res.render('projects', {user: req.user.login,
                                     projects: Project.getProjectsByIds(req.user.projects)}); 
  });

}