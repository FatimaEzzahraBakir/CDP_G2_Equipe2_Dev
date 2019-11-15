var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var releaseSchema = new mongoose.Schema({
    description: String,
    features: String,
    releaseDate: Date,
    issues: [{ type: Schema.Types.ObjectId, ref: 'issues' }],
    project: { type: Schema.Types.ObjectId, ref: 'projects' }
});

module.exports = mongoose.model('releases', releaseSchema);