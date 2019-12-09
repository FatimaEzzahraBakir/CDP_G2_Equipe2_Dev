const ProjectService = require('../services/project.service');
const SprintService = require('../services/sprint.service');
const FlashError = require('../utils/flashError');
const { check, validationResult } = require('express-validator');

exports.validate = () => {
  return ProjectService.validateNewProject();
}

exports.projectNewPost = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('newProject', {
      errors: errors.array()
    });
  }
  let projectObject = {
    name: req.body.name,
    description: req.body.description,
    members: [req.user.id]
  };

  await ProjectService.createProject(projectObject, req.user);
  return res.redirect('/user/' + req.params.login + '/projects');
}

exports.projectDetails = async function (req, res, next) {
  let members_ids = res.locals.project.members;
  members = await ProjectService.getMembers(members_ids);
  let sprintsTmp = await SprintService.getSprintsFromProject(res.locals.project.id);
  let sprint = await SprintService.getTodaySprints(sprintsTmp);
  let tasks = await ProjectService.getTasks(res.locals.project);
  return res.render('myProject', {
    user: req.user,
    project: res.locals.project,
    members: members,
    sprint: sprint,
    tasks: tasks
  });
}

exports.addMemberPost = async function (req, res, next) {
  let project = res.locals.project;
  let project_id = req.params.project_id;
  let login = req.params.login;
  let typeOfUser = req.body.inputType;
  let query = { login: req.body.memberString };
  if (typeOfUser === 'mail')
    query = { mail: req.body.memberString }

  try {
    await ProjectService.addMember(query, project_id, login);
    return res.redirect('/user/' + login + '/projects/' + project_id)
  } catch (error) {
    if (error instanceof FlashError) {
      req.flash('error', error.message);
      return res.redirect(
        '/user/' + login + '/projects/' + project_id + '/addMember');
    }
    else {
      throw error;
    }
  }
}

exports.addMemberGet = function (req, res, next) {
  return res.render('addMember', {
    userLogin: req.params.login,
    project: res.locals.project,
    error: req.flash("error")
  });
}

exports.projectUpdateGet = function (req, res, next) {
  return res.render('updateProject', {
    userLogin: req.params.login,
    project: res.locals.project,
    projectDescription: res.locals.project.description
  });
}

exports.projectUpdatePost = async function (req, res, next) {
  let project_id = req.params.project_id;
  let description = req.body.description;
  let name = req.body.name;

  await ProjectService.updateProject(project_id, name, description);
  return res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id);
}

exports.projectDeleteGet = async function (req, res, next) {
  let project = res.locals.project;
  await ProjectService.deleteProject(project);
  res.redirect('/user/' + req.params.login + '/projects/');
}

exports.projectNewGet = async function (req, res, next) {
  return res.render('newProject', { user: req.user.login });
}

exports.docNewGet = function (req, res) {
  return res.render('newDoc', {
    user: req.user.login,
    project: res.locals.project
  });
}

exports.docNewPost = function (req, res) {
  const userDoc = req.body.userDoc;
  const adminDoc = req.body.adminDoc;
  let response = {};
  if (userDoc) {
    response.user = true;
    ProjectService.setUserDoc(req.params.project_id, userDoc);
  }
  if (adminDoc) {
    response.admin = true;
    ProjectService.setAdminDoc(req.params.project_id, adminDoc);
  }
  return res.send(response);
}

exports.docGet = function (req, res) {
  let fileName = req.params.docname;
  if (fileName !== 'adminDoc.txt' && fileName !== 'userDoc.txt')
    return res.status(404).send();

  let docs = {
    "adminDoc.txt": res.locals.project.adminDoc,
    "userDoc.txt": res.locals.project.userDoc
  };

  res.set({ "Content-Disposition": "attachment; filename=\"" + fileName + "\"" });
  return res.send(docs[fileName]);
}

exports.docDelete = function (req, res) {
  let project = res.locals.project;
  let type = req.query.type;
  if (type === 'user') {
    ProjectService.setUserDoc(project._id, "");
  } else if (type === 'admin') {
    ProjectService.setAdminDoc(project._id, "");
  }
  return res.redirect('/user/' + req.params.login + '/projects/' + project._id + '/newDoc');
};