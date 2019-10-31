const express = require('express')
const app = express()
const ejs = require('ejs')
const flash = require('connect-flash');
const path = require('path')
const session = require('express-session');
const passport = require('passport');

app.use(session({ secret: 'secret',
                  resave: false, 
                  saveUninitialized: false}));


app.use(flash());

// passport
require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

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
