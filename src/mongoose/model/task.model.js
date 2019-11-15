var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskSchema = new mongoose.Schema({
    dod: String,
    state: String,
    startDate: Date,
    length:Number,
    dev:{ type: Schema.Types.ObjectId, ref: 'users' },
    issue: { type: Schema.Types.ObjectId, ref: 'issues' }
});

module.exports = mongoose.model('tasks', taskSchema);

module.exports.createTask = function createTask(taskInstance,callback) {
    const Issue = require('./issue.model'); 
    taskInstance.save(function (err, task) {
      if (err) throw err;
      Issue.findOneAndUpdate(
        { _id: req.params.issue_id },
        { $push: { tasks: task.id } },
        callback
      );
    });
}