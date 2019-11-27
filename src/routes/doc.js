const ProjectController = require('../controllers/project.controller');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id/newDoc', ProjectController.docNewGet);

  app.post('/user/:login/projects/:project_id/newDoc', ProjectController.docNewPost);

}
