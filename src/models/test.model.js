var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TestSchema = new Schema({
  num: Number,
  name: String,
  expectedResult: String,
  obtainedResult: String,
  level: Number,
  project: { type: Schema.Types.ObjectId, ref: 'projects' },
  issue: { type: Schema.Types.ObjectId, ref: 'issues'}
});

const Test = mongoose.model('tests', TestSchema);
module.exports = Test;