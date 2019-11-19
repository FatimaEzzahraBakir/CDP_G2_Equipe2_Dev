const Project = require('../mongoose/model/project.model');
const Release = require('../mongoose/model/release.model');

const { check, validationResult } = require('express-validator');

module.exports = function (app) {

  function getIssuesMap(sprints) {
    return new Promise((resolve, reject) => {
      let map = new Map();
      sprints.forEach(function(sprint){
        Release.getIssues(sprint).then((issues) => {
          if (issues.length == 0) resolve(map);
          issues.forEach(issue => {
            map.set(issue.id, issue.description);
          });
          resolve(map);
        });
      })
    });
  };

  app.get('/user/:login/projects/:project_id/sprints/newSprint', function (req, res) {
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
    return res.send('Accès non autorisé');
    Project.findById(req.params.project_id, (err, project) => {
      res.render('newSprint', {
        user: req.user,
        project: project,
        errors: [req.flash('error')]
      });
    });
  });

  app.post('/user/:login/projects/:project_id/sprints/newSprint', [
    check('date').not().isEmpty().withMessage('Date requise').custom((value) => {
      return new Promise((resolve, reject) => {
        if (!isNaN(Date.parse(value)))
        resolve(true);
        else
        reject(new Error("Format de date attendu : yyyy/mm/dd"));
      });
    }),
    check('description').not().isEmpty().withMessage('description attendue')
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', 'erreur check newSprint post')
      return res.render('newSprint', {
        user: req.user,
        project: { id: req.params.project_id }, //peut provoquer des bugs si sprints.ejs change
        errors: errors.array()
      });
    }
    let releaseInstance = new Release({
      description: req.body.description,
      releaseDate: Date.parse(req.body.date),
      issues: [],
      features: '',
      project: req.params.project_id
    });
    releaseInstance.save((err) => {
      if(err) throw err;
      res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/sprints')
    });
  })

  app.get('/user/:login/projects/:project_id/sprints', async function (req, res) {
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
    return res.send('Accès non autorisé');

    console.log("on y est");

    Release.find({project: req.params.project_id}, function (err, sprints) {
      if(err) throw err;
      console.log("la aussi");
      Project.findById(req.params.project_id).then((project) => {
        ("et la");
        getIssuesMap(sprints).then((issues_map) => {
          console.log(issues_map);
          return res.render('sprints', { user: req.user, project: project, sprints: sprints, issues_map : issues_map});
        });
      });
    })
  });

  app.get('/user/:login/projects/:project_id/sprints/delete/:sprint_id', function (req, res) {
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
    return res.send('Accès non autorisé');

    Release.findOneAndRemove(
      { _id: req.params.sprint_id },
      function (err, project) {
        if (err) throw err;
        res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + '/sprints');
      }
    );
  })

  app.get('/user/:login/projects/:project_id/sprints/update/:sprint_id', function (req, res) {
    if (typeof req.user == 'undefined' || req.params.login !== req.user.login)
    return res.send('Accès non autorisé');

    Release.findOne({
      _id: req.params.sprint_id
    }, function (err, sprint) {
      if (err) throw err;
      Project.findById(req.params.project_id).then((project) => {
        return res.render('updateSprint', { user: req.user, project: project, sprint: sprint});
      });
    });
  });

  app.post('/user/:login/projects/:project_id/sprints/update/:sprint_id', function (req, res) {
    Release.findOneAndUpdate({
      _id: req.params.sprint_id,
    },
    {
      releaseDate: new Date(req.body.date),
      description: req.body.description
    },
    function (err, project) {
      if (err) throw err;
      res.redirect('/user/' + req.params.login + '/projects/' + req.params.project_id + "/sprints");
    });
  });

}
