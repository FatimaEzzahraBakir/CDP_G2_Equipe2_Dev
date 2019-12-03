const TestController = require('../controllers/test.controller');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id/tests', TestController.TestGetList);

  app.get('/user/:login/projects/:project_id/addTest', TestController.TestAddGet);

  app.post('/user/:login/projects/:project_id/addTest',
    TestController.validate(),
    TestController.TestAddPost);

}