const ReleaseService = require('../services/release.service');
const ProjectService = require('../services/project.service');
const { check, validationResult } = require('express-validator');


exports.validate = () => {
  return ReleaseService.validateNewRelease();
}

exports.ReleaseGetList = async function (req, res, next) {
  let releases = await ReleaseService.getReleasesFromProject(res.locals.project);
  let issues = await ProjectService.getIssues(res.locals.project);
  res.render('releases', {
    project: res.locals.project,
    user: req.user,
    releases : releases,
    issues: issues
  });
}

exports.ReleaseGetNew = async function(req, res, next) {
  let issues = await ProjectService.getIssues(res.locals.project);
  res.render('newRelease',{
    user: req.user,
    project: res.locals.project,
    issues: issues,
    errors : []
  });
}

exports.ReleasePostNew = async function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let issues = await ProjectService.getIssues(res.locals.project);
    return res.render('newRelease', {
      user: req.user,
      project: res.locals.project,
      issues: issues,
      errors: errors.array()
    });
  }
  let releaseObject = {
    project: req.params.project_id,
    version : req.body.version,
    releaseDate : Date.parse(req.body.releaseDate),
    link : req.body.link,
    description: req.body.description,
    issues : req.body.issues
  }
  await ReleaseService.createRelease(releaseObject);
  return res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id +'/releases');
}

exports.ReleaseGetDelete = async function(req, res, next) {
  await ReleaseService.deleteRelease(req.params.release_id);
  return res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id +'/releases');
}