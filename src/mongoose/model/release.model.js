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

module.exports = mongoose.model('releases', releaseSchema);

module.exports.getIssues = function getIssues(sprint) {
  return new Promise(function (resolve) {
    let res = [];
    if (typeof sprint.issues == 'undefined' || sprint.issues.length === 0) {
      resolve(res);
    }
    let promises = [];
    sprint.issues.forEach(issue_id => {
      promises.push(Issue.findById(issue_id).exec());
    });
    Promise.all(promises).then(values => {
      resolve(values);
    });
  });
}
