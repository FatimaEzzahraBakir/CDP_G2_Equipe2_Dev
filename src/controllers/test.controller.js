const TestService = require('../services/test.service');
const ProjectService = require('../services/project.service');
const Test = require('../models/test.model');
const { check, validationResult } = require('express-validator');

exports.validate = () => {
    return TestService.validateNewTest();
  }
  
  exports.TestGetList = async function (req, res, next) {
    let tests = await ProjectService.getTasks(res.locals.project);
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
      issue: req.params.issue_id,
    };
    await TestService.createTask(testObject);
    return res.redirect('/user/' + req.user.login + '/projects/' + req.params.project_id + '/tests/');
  }