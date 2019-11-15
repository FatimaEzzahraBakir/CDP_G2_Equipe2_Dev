const Project = require('../mongoose/model/project.model');
const Release = require('../mongoose/model/release.model');

const { check, validationResult } = require('express-validator');

module.exports = function (app) {
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

}