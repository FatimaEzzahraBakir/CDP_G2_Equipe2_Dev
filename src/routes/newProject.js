module.exports = function(app){

  app.get('/newProject', function(req, res) {
    res.render('newProject');
  });

  app.post('/newProject', function(req, res) {
    //ajouter action d'insertion en BD
    res.render('newProject');
  });
}
