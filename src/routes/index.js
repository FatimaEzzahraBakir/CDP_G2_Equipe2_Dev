module.exports = function(app){
  app.get('/', function (req, res) {
    res.render('index', {user: req.user});
  })

  app.post('/', function (req, res) {
    res.render('index');
  })
}
