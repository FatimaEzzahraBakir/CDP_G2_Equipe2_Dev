const TestService = require('../services/test.service');
const ProjectService = require('../services/project.service');
const { check, validationResult } = require('express-validator');

exports.validate = () => {
    return TestService.validateNewTest();
  }
  
  exports.TestGetList = async function (req, res, next) {
    let tests = await ProjectService.getTests(res.locals.project);
    return res.render('tests', {
      user: req.user.login,
      project: res.locals.project,
      tests: tests
    });
  }
  
  exports.TestAddGet = async function (req, res, next) {
    return res.render('addTest', {
      userLogin: req.params.login,
      project: res.locals.project,
      errors: [req.flash("error")]
    });
  }

  exports.TestAddPost = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('addTest', {
        errors: errors.array(),
        userLogin: req.params.login,
        project: res.locals.project,
      });
    }
   
    let project = res.locals.project;
    let testObject = {
      num: req.body.num,
      name: req.body.name,
      expectedResult: req.body.expectedResult,
      obtainedResult: req.body.obtainedResult,
      level: req.body.level,
      project: project.id,
    };
    await TestService.createTest(testObject);
    return res.redirect('/user/' + req.user.login + '/projects/' + req.params.project_id + '/tests/');
  }
  module.exports.testsDeleteTestGet = async function (req, res, next) {
    await TestService.deleteTest(req.params.id);
    return res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/tests');
  }

exports.TestUpdateGet = async function (req, res, next) {
  let test = await ProjectService.getTest(res.locals.project, req.params.test_id);
  return res.render('updateTest', {
    user: req.user,
    project: res.locals.project,
    test: test[0]
  });
}

exports.TestUpdatePost = async function (req, res, next) {
  await TestService.updateTest(req.params.test_id, req.body.name, req.body.expectedResult, req.body.obtainedResult, req.body.level);
  res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + "/tests");
}