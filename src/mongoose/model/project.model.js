const Issue = require('./issue.model');

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var projectSchema = new Schema({
    name: String,
    description: String,
    members: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    issues: [{ type: Schema.Types.ObjectId, ref: 'issues' }]
});

module.exports = mongoose.model('projects', projectSchema);

module.exports.getMembers = function getMembers(project){
  const User = require('./user.model'); //TODO pourquoi il faut mettre ça la ???
  return new Promise(function(resolve) {
    let res = [];
    if(typeof project.members == 'undefined' || project.members.length === 0){
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

module.exports.getIssues = function getIssues(project){
  return new Promise(function(resolve) {
    let res = [];
    if(typeof project.issues == 'undefined' || project.issues.length === 0){
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
