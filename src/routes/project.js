const Project = require('../mongoose/model/project.model');
const User = require('../mongoose/model/user.model');

module.exports = function (app) {

  app.get('/user/:login/projects/:name', async function (req, res) {
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
      return res.send('Accès non autorisé');
    /// fonctionnement à vérifier
    let userProjects = await User.find({ login: req.params.login });
    let project;
    let projectPromise = new Promise(function (resolve, reject) {
      userProjects[0].projects.forEach(async function (p) {
        let tmp = await Project.findById(p);
        if (tmp.name == req.params.name)
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


    });
  });


  app.get('/user/:login/projects/:name/addMember', function (req, res) {
    res.render('addMember', { userLogin: req.params.login, projectName: req.params.name, error: req.flash("error") });
  });

  app.post('/user/:login/projects/:projectname/addMember', function (req, res) {
    console.log('POST addMember')
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
          return res.redirect('/user/:login/projects/:name/addMember');
        }
        //ajoute user au project        
        Project.findOneAndUpdate(
          {
            name: req.params.projectname,
            members: req.user.id
          },
          { $push: { members: userInvited.id } },
          //ajoute project au user
          function (err, project) {
            User.findOneAndUpdate(
              query,
              { $push: { projects: project.id } },
              function (err, user) {
                res.redirect('/user/' + req.params.login + '/projects/' + project.name);
              }
            )
          }
        )
      }
    )
  });
}