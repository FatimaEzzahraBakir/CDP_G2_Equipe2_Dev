const SprintController = require('../controllers/sprint.controller');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id/sprints/newSprint', SprintController.SprintNewGet);

  app.post('/user/:login/projects/:project_id/sprints/newSprint',
    SprintController.validate(),
    SprintController.SprintNewPost);

  app.get('/user/:login/projects/:project_id/sprints', SprintController.SprintsGet);

  app.get('/user/:login/projects/:project_id/sprints/:sprint_id/delete', SprintController.SprintDeleteGet);

  app.get('/user/:login/projects/:project_id/sprints/:sprint_id/update', SprintController.SprintUpdateGet);

  app.post('/user/:login/projects/:project_id/sprints/:sprint_id/update', SprintController.SprintUpdatePost);

  app.get('/user/:login/projects/:project_id/sprints/:sprint_id', SprintController.SprintDetailsGet);

  app.get('/user/:login/projects/:project_id/sprints/:sprint_id/issues', SprintController.SprintIssuesGet);

  app.get('/user/:login/projects/:project_id/sprints/:sprint_id/tasks', SprintController.SprintTasksGet);

  app.get('/user/:login/projects/:project_id/sprints/:sprint_id/sprintOver', SprintController.SprintOverGet);

  app.post('/user/:login/projects/:project_id/sprints/:sprint_id/sprintOver', SprintController.SprintOverPost);

}
