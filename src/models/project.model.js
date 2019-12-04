var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var projectSchema = new Schema({
  name: String,
  description: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  issues: [{ type: Schema.Types.ObjectId, ref: 'issues' }],
  tasks: [{ type: Schema.Types.ObjectId, ref: 'tasks' }],
  tests: [{ type: Schema.Types.ObjectId, ref: 'tests' }],
  userDoc : String,
  adminDoc : String
});

const Project = mongoose.model('projects', projectSchema);
module.exports = Project;