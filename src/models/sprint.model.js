var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var sprintSchema = new Schema({
    num: Number,
    description: String,
    features: String,
    startDate: Date,
    endDate: Date,
    issues: [{ type: Schema.Types.ObjectId, ref: 'issues' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'tasks' }],
    project: { type: Schema.Types.ObjectId, ref: 'projects' }
}, {
  usePushEach: true
});

const Sprint = mongoose.model('sprints', sprintSchema);
module.exports = Sprint;