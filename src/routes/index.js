const Project = require('../models/project.model');

module.exports = function(app){

  app.all(/\/user\/([a-zA-z0-9_\-]+)\/.*/ , function(req, res, next) {
    let urluser = req.params[0];
    if (typeof req.user == 'undefined' || urluser != req.user.login)
      return res.status(401).send('Accès non autorisé');
    next();
  });

  app.all(/\/user\/([a-zA-z0-9_\-]+)\/projects\/([a-z0-9]+)\/?.*/ , function(req, res, next) {
    let project_id = req.params[1];
    Project.findById(project_id, (err, project) => {
      if(err) return res.status(404).send('Projet non trouvé');
      res.locals.project = project;
      if(!project.members.includes(req.user.id)){
        return res.status(401).send('Accès non autorisé (pas membre du projet)');
      }
      next();
    });
  });

  app.get('/', function (req, res) {
    res.render('index', {user: req.user});
  })

  app.post('/', function (req, res) {
    res.render('index');
  })
}
