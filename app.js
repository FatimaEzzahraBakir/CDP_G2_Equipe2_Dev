const express = require('express')
const app = express()
const ejs = require('ejs')
const flash = require('connect-flash');
const path = require('path')
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/cdpdb'


mongoose.connect(mongoDB, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console,'MongoDB connection error:'));

app.use(session({ secret: 'secret',
                  resave: false,
                  saveUninitialized: false}));


app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));

// passport
require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

require('./src/routes/index')(app)
require('./src/routes/signin')(app)
require('./src/routes/signup')(app)
// set the view engine to ejs
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'))
app.use(express.static(path.join(__dirname , 'public')));


app.listen(8080);
