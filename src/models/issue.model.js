var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var issueSchema = new Schema({
  num: Number,
  description: String,
  priority: String,
  difficulty: Number,
  state:String,
  project: { type: Schema.Types.ObjectId, ref: 'projects' },
  release: { type: Schema.Types.ObjectId, ref: 'release' },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'tasks' }]
});

const Issue = mongoose.model('issues', issueSchema);
module.exports = Issue;