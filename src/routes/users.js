const UserController = require('../controllers/user.controller');

module.exports = function (app) {

  app.get('/signin', UserController.UserLoginGet);

  app.post('/signin', UserController.UserLoginPost);

  app.get('/signup', UserController.UserSignupGet);

  app.post('/signup', UserController.validate(),UserController.UserSignupPost);

  app.get('/user/:login/projects', UserController.UserProjectListGet);

  app.get('/logout', UserController.UserLogoutGet);

}
