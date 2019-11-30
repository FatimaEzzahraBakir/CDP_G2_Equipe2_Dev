const ReleaseController = require('../controllers/release.controller');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id/releases', ReleaseController.ReleaseGetList);

  app.get('/user/:login/projects/:project_id/releases/new', ReleaseController.ReleaseGetNew);

  app.post('/user/:login/projects/:project_id/releases/new', ReleaseController.validate(), ReleaseController.ReleasePostNew);

  app.get('/user/:login/projects/:project_id/releases/:release_id/delete', ReleaseController.ReleaseGetDelete);

}