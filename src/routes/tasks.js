
const TaskController = require('../controllers/task.controller');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id/tasks', TaskController.TaskGetList);

  app.get('/user/:login/projects/:project_id/sprints/:sprint_id/addTask', TaskController.TaskAddGet);

  app.post('/user/:login/projects/:project_id/sprints/:sprint_id/addTask',
    TaskController.validate(),
    TaskController.TaskAddPost);

  app.get('/user/:login/projects/:project_id/sprints/:sprint_id/tasks/:task_id/delete', TaskController.TaskDeleteGet);

  app.get('/user/:login/projects/:project_id/sprints/:sprint_id/tasks/:task_id/addDev', TaskController.TaskAddDevGet);

  app.post('/user/:login/projects/:project_id/sprints/:sprint_id/tasks/:task_id/addDev', TaskController.TaskAddDevPost);

  app.get('/user/:login/projects/:project_id/sprints/:sprint_id/tasks/:task_id/update', TaskController.TaskUpdateGet);

  app.post('/user/:login/projects/:project_id/sprints/:sprint_id/tasks/:task_id/update', TaskController.TaskUpdatePost);
}