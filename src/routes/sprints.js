const ReleaseController = require('../controllers/release.controller');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id/sprints/newSprint', ReleaseController.ReleaseNewGet);

  app.post('/user/:login/projects/:project_id/sprints/newSprint',
    ReleaseController.validate(),
    ReleaseController.ReleaseNewPost);

  app.get('/user/:login/projects/:project_id/sprints', ReleaseController.ReleasesGet);

  app.get('/user/:login/projects/:project_id/sprints/delete/:sprint_id', ReleaseController.ReleaseDeleteGet);

  app.get('/user/:login/projects/:project_id/sprints/update/:sprint_id', ReleaseController.ReleaseUpdateGet);

  app.post('/user/:login/projects/:project_id/sprints/update/:sprint_id', ReleaseController.ReleaseUpdatePost);

}
