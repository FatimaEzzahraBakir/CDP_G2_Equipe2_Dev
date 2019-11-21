const ProjectController = require('../controllers/project.controller');

module.exports = function (app) {

  app.get('/user/:login/newProject', ProjectController.projectNewGet);

  app.post('/user/:login/newProject', 
  ProjectController.validate(),
  ProjectController.projectNewPost);

  app.get('/user/:login/projects/:project_id', ProjectController.projectDetails);

  app.get('/user/:login/projects/:project_id/addMember', ProjectController.addMemberGet);

  app.post('/user/:login/projects/:project_id/addMember', ProjectController.addMemberPost);

  app.get('/user/:login/projects/:project_id/update', ProjectController.projectUpdateGet);

  app.post('/user/:login/projects/:project_id/update', ProjectController.projectUpdatePost);

  app.get('/user/:login/projects/:project_id/delete', ProjectController.projectDeleteGet);
}