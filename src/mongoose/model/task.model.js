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

module.exports = mongoose.model('tasks', taskSchema);

module.exports.createTask = function createTask(taskInstance,callback) {
    const Project = require('./project.model'); 
    taskInstance.save(function (err, task) {
      if (err) throw err;
      Project.findOneAndUpdate(
        { _id: req.params.project_id },
        { $push: { tasks: task.id } },
        callback
      );
    });
}