var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var issueSchema = new mongoose.Schema({
    description: String,
    priority: String,
    difficulty: Number,
    state:String,
    projects: { type: Schema.Types.ObjectId, ref: 'projects' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'tasks' }]
});

module.exports = mongoose.model('issues', issueSchema);
