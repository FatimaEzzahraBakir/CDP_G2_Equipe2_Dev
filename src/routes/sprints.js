const SprintController = require('../controllers/sprint.controller');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id/sprints/newSprint', SprintController.SprintNewGet);

  app.post('/user/:login/projects/:project_id/sprints/newSprint',
    SprintController.validate(),
    SprintController.SprintNewPost);

  app.get('/user/:login/projects/:project_id/sprints', SprintController.SprintsGet);

  app.get('/user/:login/projects/:project_id/sprints/delete/:sprint_id', SprintController.SprintDeleteGet);

  app.get('/user/:login/projects/:project_id/sprints/update/:sprint_id', SprintController.SprintUpdateGet);

  app.post('/user/:login/projects/:project_id/sprints/update/:sprint_id', SprintController.SprintUpdatePost);

}
