var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var taskSchema = new mongoose.Schema({
    dod: String,
    state: String,
    startDate: Date,
    length:Number,
    dev:{ type: Schema.Types.ObjectId, ref: 'users' },
    issues: { type: Schema.Types.ObjectId, ref: 'issues' }
});
module.exports = mongoose.model('tasks', taskSchema);
