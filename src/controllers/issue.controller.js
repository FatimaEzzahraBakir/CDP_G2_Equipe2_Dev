const IssueService = require('../services/issue.service');
const ProjectService = require('../services/project.service');
const { check, validationResult } = require('express-validator');


module.exports.validate = () => {
  return IssueService.validateNewIssue();
}

module.exports.backlogGet = async function (req, res, next) {

  let project = res.locals.project;
  let issues = await ProjectService.getIssues(project);
  return res.render('backlog', {
    user: req.user.login,
    project: project,
    issues: issues
  });
}

module.exports.backlogDeleteIssueGet = async function (req, res, next) {
  await IssueService.deleteIssue(req.params.id);
  return res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/backlog');
}

module.exports.backlogUpdateIssueGet = async function (req, res, next) {

  let project = res.locals.project;
  let issue_id = req.params.id;

  let promises = await [
    IssueService.getIssue(issue_id)
  ];

  Promise.all(promises).then((values) => {
    return res.render('updateIssue', { user: req.user.login, project: project, issue: values[0] });
  }).catch((err) => { throw err; });

}

module.exports.backlogUpdateIssuePost = async function (req, res, next) {
  let issue_id = req.params.id;
  await IssueService.updateIssue(issue_id, req.body.description, req.body.difficulty, req.body.state, req.body.priority);
  res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/backlog');
}

module.exports.backlogAddIssueGet = function (req, res, next) {
  return res.render('addIssue', { userLogin: req.params.login, project: res.locals.project, errors: [req.flash("error")] });
}

module.exports.backlogAddIssuePost = async function (req, res, next) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('addIssue', {
      userLogin: req.params.login,
      project: res.locals.project,
      errors: errors.array()
    });
  }

  let project = res.locals.project;

  let issueObject = {
    project: project.id,
    num: req.body.num,
    description: req.body.description,
    priority: req.body.priority,
    difficulty: req.body.difficulty,
    state: req.body.state,
    tasks: []
  };

  await IssueService.createIssue(issueObject);
  return res.status(200).json({ status: "ok" })
  //return res.redirect(200, '/user/' + req.user.login + '/projects/' + req.params.project_id + '/backlog');
}
