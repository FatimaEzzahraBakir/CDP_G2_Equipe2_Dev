const IssueController = require('../controllers/issue.controller');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id/backlog', IssueController.backlogGet);

  app.get('/user/:login/projects/:project_id/backlog/:id/delete', IssueController.backlogDeleteIssueGet);

  app.get('/user/:login/projects/:project_id/backlog/:id/update', IssueController.backlogUpdateIssueGet);

  app.post('/user/:login/projects/:project_id/backlog/:id/update', IssueController.backlogUpdateIssuePost);

  app.get('/user/:login/projects/:project_id/addIssue', IssueController.backlogAddIssueGet);

  app.post('/user/:login/projects/:project_id/addIssue',
   IssueController.validate(),
   IssueController.backlogAddIssuePost);
}
