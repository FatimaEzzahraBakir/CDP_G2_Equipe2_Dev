var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskSchema = new mongoose.Schema({
  num: Number,
  description: String,
  dod: String,
  state: String,
  length: Number,
  sprint: { type: Schema.Types.ObjectId, ref: 'sprints' },
  project: { type: Schema.Types.ObjectId, ref: 'projects' },
  dev: { type: Schema.Types.ObjectId, ref: 'users' },
  issues: [{ type: Schema.Types.ObjectId, ref: 'issues' }]
}, {
  usePushEach: true
});

const Task = mongoose.model('tasks', taskSchema);
module.exports = Task;