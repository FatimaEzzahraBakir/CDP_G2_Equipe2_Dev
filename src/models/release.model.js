var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var releaseSchema = new Schema({
    description: String,
    features: String,
    releaseDate: Date,
    version: String,
    issues: [{ type: Schema.Types.ObjectId, ref: 'issues' }],
    project: { type: Schema.Types.ObjectId, ref: 'projects' }
});

const Release = mongoose.model('releases', releaseSchema);
module.exports = Release;