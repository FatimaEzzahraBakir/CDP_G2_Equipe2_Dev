const ReleaseService = require('../services/release.service');
const { check, validationResult } = require('express-validator');

exports.validate = function () {
  return ReleaseService.validateNewRelease();
}

exports.ReleaseNewGet = function (req, res, next) {
  res.render('newSprint', {
    user: req.user,
    project: res.locals.project,
    errors: [req.flash('error')]
  });
}

exports.ReleaseNewPost = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('newSprint', {
      user: req.user,
      project: res.locals.project,
      errors: errors.array()
    });
  }
  let releaseObject = {
    description: req.body.description,
    releaseDate: Date.parse(req.body.date),
    issues: [],
    features: '',
    project: req.params.project_id
  };
  await ReleaseService.createRelease(releaseObject);
  res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/sprints');

}

exports.ReleasesGet = async function (req, res, next) {
  let releases = await ReleaseService.getReleasesFromProject(req.params.project_id);
  let issues_map = await ReleaseService.getIssuesMap(releases);
  return res.render('sprints', { user: req.user, project: res.locals.project, sprints: releases, issues_map: issues_map });
}

exports.ReleaseDeleteGet = async function (req, res, next) {
  await ReleaseService.deleteRelease(req.params.sprint_id);
  res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/sprints');
}

exports.ReleaseUpdateGet = async function (req, res, next) {
  let release = await ReleaseService.getRelease(req.params.sprint_id);
  return res.render('updateSprint', {
    user: req.user,
    project: res.locals.project,
    sprint: req.params.sprint_id
  });
}

exports.ReleaseUpdatePost = async function (req, res, next) {
  await ReleaseService.updateRelease(req.params.sprint_id, req.body.date, req.body.description);
  res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + "/sprints");
}