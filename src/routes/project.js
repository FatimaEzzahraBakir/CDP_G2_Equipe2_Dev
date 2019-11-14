const Project = require('../mongoose/model/project.model');
const User = require('../mongoose/model/user.model');

module.exports = function (app) {

  app.get('/user/:login/projects/:project_id', async function (req, res) {
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');

    /*
    let userProjects = await User.find({ login: req.params.login });
    let project;
    let projectPromise = new Promise(function (resolve, reject) {
      userProjects[0].projects.forEach(async function (p) {
        let tmp = await Project.findById(p);
        if (tmp.id == req.params.project_id)
          resolve(tmp);
      })
    });

    projectPromise.then(function (p) {
      project = p;

      let members = new Promise(function (resolve) {
        let res = [];
        if (typeof project.members == 'undefined') {
          resolve(res);
        }
        project.members.forEach(function (user_id, i) {
          User.findById(user_id).exec().then(function (user) {
            res.push(user);
            if (i === (project.members.length - 1)) resolve(res);
          });
        });
      }).then(function (mem) {
        return res.render('myProject', {
          user: req.user.login,
          project: project,
          members: mem
        });
      });


    }); */
    Project.findById(req.params.project_id).then((project) => {
      Project.getMembers(project).then((members) => {
        res.render('myProject', {
          user: req.user.login,
          project: project,
          members: members
        });
      })
    });
  });

  app.get('/user/:login/projects/:project_id/addMember', function (req, res) {
    Project.findById(req.params.project_id).then((project) => {
      res.render('addMember', { userLogin: req.params.login, project: project, error: req.flash("error") });
    }).catch((error) => {
      console.log('catch get addmember' + error); // TODO
    });
  });

  app.post('/user/:login/projects/:project_id/addMember', function (req, res) {
    let typeOfUser = req.body.inputType;
    let query;
    if (typeOfUser === 'login')
      query = { login: req.body.memberString }
    else if (typeOfUser === 'mail')
      query = { mail: req.body.memberString }

    User.findOne(
      query,
      function (err, userInvited) {
        if (err) throw err;
        if (!userInvited) {
          req.flash('error', "L'utilisateur n'a pas été trouvé");
          return res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/addMember');
        }
        //ajoute user au project        
        Project.findOneAndUpdate(
          {
            _id: req.params.project_id,
            members: req.user.id
          },
          { $addToSet: { members: userInvited.id } },
          //ajoute project au user
          function (err, project, doc) {
            User.findOneAndUpdate(
              query,
              { $addToSet: { projects: project.id } },
              function (err, user) {
                res.redirect('/user/' + req.params.login + '/projects/' + project.id);
              }
            )

          }
        )
      }
    )
  });

  app.get('/user/:login/projects/:project_id/update', function (req, res) {
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');
    Project.findOne({
      _id: req.params.project_id
    }, function (err, project) {
      if (err) throw err;
      res.render('updateProject',
        {
          userLogin: req.params.login,
          project: project,
          projectDescription: project.description
        });
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
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');
    Project.findOneAndRemove({
      _id: req.params.project_id,
      members: req.user.id
    }, function (err, project) {
      if (err) throw err;
      User.updateMany(
        {
          _id: { $in: project.members }
        },
        {
          $pull: { projects: project.id }
        },
        function (err, result) {
          if (err) throw err;
          res.redirect('/user/' + req.params.login + '/projects/');
        })
    });
  });
}