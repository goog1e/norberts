var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs  = require('express-handlebars');
var basicAuth = require('basic-auth-connect');
var config = require('./config.json');
var app = express();

var db = require('./lib/db');

app.use(basicAuth(config.auth.user, config.auth.password));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(logger('common'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
  res.render('customers', {customers: fakeContacts});
});

app.post('/new', function(req,res) {
  db.update(req.body, function(err) {
    if (err) console.error('DB:ERROR writing ', req.body, ' to database. !!! ', err);
    else {
      console.log('DB:SUCCESS writing', req.body, ' to database.');
    }
  });

  res.redirect('/customers');
});

app.listen(config.port, function () {
  console.log('Example app listening on port ' + config.port);
});
