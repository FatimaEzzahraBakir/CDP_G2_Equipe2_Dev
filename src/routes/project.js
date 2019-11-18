const Project = require('../mongoose/model/project.model');
const User = require('../mongoose/model/user.model');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id', async function (req, res) {
    Project.getMembers(res.locals.project).then((members) => {
      res.render('myProject', {
        user: req.user.login,
        project: res.locals.project,
        members: members
      });
    });
  });

  app.get('/user/:login/projects/:project_id/addMember', function (req, res) {
    res.render('addMember', {
      userLogin: req.params.login,
      project: res.locals.project,
      error: req.flash("error")
    });
  });

  app.post('/user/:login/projects/:project_id/addMember', function (req, res) {
    let typeOfUser = req.body.inputType;
    let query;
    if (typeOfUser === 'login')
      query = { login: req.body.memberString }
    else if (typeOfUser === 'mail')
      query = { mail: req.body.memberString }

    User.findOneAndUpdate(
      query,
      { $addToSet: { projects: req.params.project_id } }, //ajoute project au user
      function (err, userInvited) {
        if (err) throw err;
        if (!userInvited) {
          req.flash('error', "L'utilisateur n'a pas été trouvé");
          return res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/addMember');
        }
        //ajoute user au project        
        Project.findOneAndUpdate(
          { _id: req.params.project_id },
          { $addToSet: { members: userInvited.id } },
          function (err, project) {
            res.redirect('/user/' + req.params.login + '/projects/' + project.id);
          }
        )
      }
    )
  });

  app.get('/user/:login/projects/:project_id/update', function (req, res) {
    res.render('updateProject', {
      userLogin: req.params.login,
      project: res.locals.project,
      projectDescription: res.locals.project.description
    });
  });

  app.post('/user/:login/projects/:project_id/update', function (req, res) {
    Project.findOneAndUpdate({
      _id: req.params.project_id,
    },
      {
        name: req.body.name,
        description: req.body.description
      },
      function (err, project) {
        if (err) throw err;
        res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id);
      });
  });

  app.get('/user/:login/projects/:project_id/delete', function (req, res) {
    Project.deleteProject(req.params.project_id, function (err, result) {
      if (err) throw err;
      res.redirect('/user/' + req.params.login + '/projects/');
    });
  });
}