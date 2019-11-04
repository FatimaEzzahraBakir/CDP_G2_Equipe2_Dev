module.exports = function(app){
  app.get('/', function (req, res) {
    res.render('index');
  })

  app.post('/', function (req, res) {
    res.render('index');
  })
}
