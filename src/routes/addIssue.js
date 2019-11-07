const Issue = require('../mongoose/model/issue.model');
const User = require('../mongoose/model/project.model');
const Task = require('../mongoose/model/task.model');

module.exports = function (app) {
    app.get('/user/:login/projects/:name/addIssue', function(req, res) {
        res.render('addIssue',{ userLogin: req.params.login, projectName: req.params.name, error: req.flash("error") });
      });

    app.post('', function(req, res){
             
        res.render('addIssue');
    });
}