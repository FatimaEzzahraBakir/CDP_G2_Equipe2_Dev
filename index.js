const express = require('express')
const app = express()
const ejs = require('ejs')
var path = require('path')
require('./src/app/signin')(app)
require('./src/app/signup')(app)
// set the view engine to ejs
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'))
app.use(express.static(path.join(__dirname , 'public')));

app.get('/', function (req, res) {
  res.render('index');
})

app.listen(8080);
