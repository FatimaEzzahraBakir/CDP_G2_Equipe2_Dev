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
module.exports = mongoose.model('users', userSchema);