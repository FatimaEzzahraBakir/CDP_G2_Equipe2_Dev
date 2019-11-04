module.exports = function(app){

    app.get('/login', function(req, res){
        res.render('login');
    });
  
    app.get('/signup', function(req, res) {
      res.render('signup');
    });
    
    app.post('/signup', function(req, res) {
      res.send('database not yet implemented');
    })
  }