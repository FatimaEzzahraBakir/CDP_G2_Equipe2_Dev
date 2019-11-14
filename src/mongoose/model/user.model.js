const bcrypt = require('bcrypt');

const Project = require('./project.model');

var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mail: String,
  login: String,
  password: String,
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'projects' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tasks' }]
});

module.exports = mongoose.model('users', userSchema);

module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    })
  })
}

module.exports.getProjects = function getProjects(user){
  return new Promise(function(resolve) {
    let res = [];
    if(typeof user.projects == 'undefined' || user.projects.length === 0){
      resolve(res);
    }
   let promises = [];
   user.projects.forEach(project_id => {
     promises.push(Project.findById(project_id).exec())
   });
   Promise.all(promises).then(values => {
     resolve(values);
   });
  });
}

module.exports.validPassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}