var mongoose = require("mongoose");
const Issue = require('./issue.model');
var Schema = mongoose.Schema;

var releaseSchema = new mongoose.Schema({
    description: String,
    features: String,
    releaseDate: Date,
    issues: [{ type: Schema.Types.ObjectId, ref: 'issues' }],
    project: { type: Schema.Types.ObjectId, ref: 'projects' }
});

const Release = mongoose.model('releases', releaseSchema);
module.exports = Release;