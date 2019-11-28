var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DocSchema = new Schema({
  num: Number,
  description: String,
  type: String,
  project: { type: Schema.Types.ObjectId, ref: 'projects' },
});

const Doc = mongoose.model('docs', DocSchema);
module.exports = Doc;