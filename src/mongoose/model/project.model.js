var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var projectSchema = new Schema({
    name: String,
    description: String,
    members: { type: Schema.Types.ObjectId, ref: 'users' },
    issues: { type: Schema.Types.ObjectId, ref: 'issues' }
});

var Project = module.exports = mongoose.model('projects', projectSchema);

module.exports.getProjectsByIds = function(ids){
  let res = [];
  if(typeof ids == 'undefined') return res;
  ids.array.forEach(id => {
    Project.findById(id, function(err, proj){
      if(err) throw err;
      res.push(proj);
    });
  });
  return res;
}