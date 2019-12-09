var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  firstName:  { 
                type: String, 
                required: true 
              },
  lastName:   { 
               type: String, 
               required: true 
              },
  mail:       { 
                type: String, 
                required: true 
              },
  login:      { 
                type: String, 
                required: true 
              },
  password:   { 
                type: String, 
                required: true 
              },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'projects' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tasks' }]
});

const User = mongoose.model('users', userSchema);
module.exports = User;