const express = require('express');
const app = express();
const ejs = require('ejs');
const flash = require('connect-flash');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mongoDB = 'mongodb://mongo:27017/cdp-project'
//const mongoDB = 'mongodb+srv://dbAdmin:admindbCDP@cluster0-ryf5h.azure.mongodb.net/test?retryWrites=true&w=majority'

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


// set the view engine to ejs
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname , 'public')));

require('./routes/index')(app);
require('./routes/users')(app);
require('./routes/project')(app);
require('./routes/backlog')(app);
require('./routes/sprints')(app);
require('./routes/tasks')(app);
require('./routes/doc')(app);
require('./routes/releases')(app);
require('./routes/tests')(app);

app.listen(8080);
