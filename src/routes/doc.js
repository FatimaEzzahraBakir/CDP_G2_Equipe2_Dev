const ProjectController = require('../controllers/project.controller');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id/newDoc', ProjectController.docNewGet);

  app.post('/user/:login/projects/:project_id/newDoc', ProjectController.docNewPost);

  app.get('/user/:login/projects/:project_id/doc/:docname', ProjectController.docGet);

  app.get('/user/:login/projects/:project_id/deleteDoc', ProjectController.docDelete); 

}
