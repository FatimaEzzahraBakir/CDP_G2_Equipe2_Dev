var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskSchema = new mongoose.Schema({
    description:String,
    dod: String,
    state: String,
    length: Number,
    project: { type:Schema.Types.ObjectId, ref: 'projects'},
    dev: { type: Schema.Types.ObjectId, ref: 'users' },
    issues: [{ type: Schema.Types.ObjectId, ref: 'issues' }]
});

const Task = mongoose.model('tasks', taskSchema);
module.exports = Task;