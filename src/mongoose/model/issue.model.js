var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var issueSchema = new mongoose.Schema({
    description: String,
    priority: String,
    difficulty: Number,
    state:String,
    project: { type: Schema.Types.ObjectId, ref: 'projects' },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'tasks' }]
});

module.exports = mongoose.model('issues', issueSchema);

module.exports.getTasks = function getTasks(issue){
  return new Promise(function(resolve) {
    let res = [];
    if(typeof project.tasks == 'undefined' || project.tasks.length === 0){
      resolve(res);
    }
   let promises = [];
   project.tasks.forEach(task_id => {
     promises.push(Task.findById(task_id).exec())
   });
   Promise.all(promises).then(values => {
     resolve(values);
   });
  });
}