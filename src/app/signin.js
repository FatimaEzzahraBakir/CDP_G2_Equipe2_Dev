module.exports = function(app){

  app.get('/login', function(req, res){
      res.render('login');
  });

  app.get('/signin', function(req, res) {
    res.render('signin');
  });
  
  app.post('/signin', function(req, res) {
    res.send('database not yet implemented');
  })
}