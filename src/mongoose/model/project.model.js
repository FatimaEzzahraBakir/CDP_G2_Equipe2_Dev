var mongoose = require("mongoose");
var projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    members: { type: Schema.Types.ObjectId, ref: 'users' },
    issues: { type: Schema.Types.ObjectId, ref: 'issues' }
});
module.exports = mongoose.model('projects', projectSchema);