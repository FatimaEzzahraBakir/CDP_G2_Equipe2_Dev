const bcrypt = require('bcrypt');

var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mail:String,
    login:String,
    password:String,
    projects: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    tasks: { type: mongoose.Schema.Types.ObjectId, ref: 'tasks' }
});

var User = module.exports = mongoose.model('users', userSchema);

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    })
  })
}