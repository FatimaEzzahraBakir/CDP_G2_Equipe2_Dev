const Issue = require('./issue.model');
const Task = require('./task.model');
const Release = require('./release.model');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var projectSchema = new Schema({
  name: String,
  description: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  issues: [{ type: Schema.Types.ObjectId, ref: 'issues' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'tasks' }]
});

const Project = module.exports = mongoose.model('projects', projectSchema);

module.exports.createProject = function createProject(projectInstance, user, callback) {
  const User = require('./user.model'); // ?
  projectInstance.save(function (err, project) {
    if (err) throw err;
    User.findOneAndUpdate(
      { login: user.login },
      { $push: { projects: project.id } },
      callback
    );
  });
}

module.exports.deleteProject = function deleteProject(project, callback) {
  const User = require('./user.model'); //?

  let promises = [
    Task.deleteMany({ project: project.id }).exec(),
    Issue.deleteMany({ project: project.id }).exec(),
    Release.deleteMany({ project: project.id }).exec()
  ]

  User.updateMany(
    { _id: project.members },
    { $pull: { tasks: { $in: project.tasks }, projects: project.id } },
    (err, user) => {
    if(err) throw err;
      Promise.all(promises).then(() => {
        Project.findByIdAndDelete(project.id, callback);
      });
    });
}

module.exports.getMembers = function getMembers(project) {
  const User = require('./user.model'); //TODO pourquoi il faut mettre ça la ???
  return new Promise(function (resolve) {
    let res = [];
    if (typeof project.members == 'undefined' || project.members.length === 0) {
      resolve(res);
    }
    let promises = [];
    project.members.forEach(member_id => {
      promises.push(User.findById(member_id).exec());
    });
    Promise.all(promises).then(values => {
      resolve(values);
    });
  });
}

module.exports.getIssues = function getIssues(project) {
  return new Promise(function (resolve) {
    let res = [];
    if (typeof project.issues == 'undefined' || project.issues.length === 0) {
      resolve(res);
    }
    let promises = [];
    project.issues.forEach(issue_id => {
      promises.push(Issue.findById(issue_id).exec());
    });
    Promise.all(promises).then(values => {
      resolve(values);
    });
  });
}
module.exports.getTasks = function getTasks(project) {
  return new Promise(function (resolve) {
    let res = [];
    if (typeof project.tasks == 'undefined' || project.tasks.length === 0) {
      resolve(res);
    }
    let promises = [];
    project.tasks.forEach(task_id => {
      promises.push(Task.findById(task_id).exec());
    });
    Promise.all(promises).then(values => {
      resolve(values);
    });
  });

}