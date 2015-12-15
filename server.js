var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
global.STATUS = "production"; //set STATUS to 'production', 'dev', or 'dev-local'
if (STATUS == "production") {
  var port = process.env.PORT || 8001;
} else {
  var port = process.env.PORT || 8002;
}
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('views/depends'));
app.set('view engine', 'ejs'); // set up ejs for templating
app.set("views", "./views");
// required for passport
app.use(session({
  secret: 'b703eb43-84d5-44f2-bfe9-f3ef321803f6'
})); // session secret--a UUID would be good here
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// launch ======================================================================
app.listen(port);
console.log('The server is live on port ' + port);
