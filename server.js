var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs  = require('express-handlebars');
var basicAuth = require('basic-auth-connect');
var config = require('./config.json');
var app = express();

var db = require('./lib/db');
var sendDump = require('./lib/send-dump.js');

// initialize contacts cache
var lastContactsCount = 0;
var contactsCache = [];
db.getContacts(function(contacts) {
  contactsCache = contacts;
  lastContactsCount = contacts.length;
});

// daily cronjob to send backups to admins
var CronJob = require('cron').CronJob;
new CronJob('00 30 11 * * 1-5',
            weeklyTask,
            cronJobComplete,
            startCronNow,
            timeZone);

function cronJobComplete() {
  console.log('CRONJON COMPLETE');
}

function weeklyTask() {
  var dataDump = JSON.stringify(contactsCache, null, 2);
  var contactCountDiff = contactsCache.length - lastContactsCount;
  config.backupContacts.forEach(function(c) {
    sendDump(c, contactCountDiff, dataDump);
  });
  fs.writeFile('stub-data/contacts.json', dataDump, function(err) {
    if (err) console.error('BACKUP:ERROR:Error writing backup!!!! contact admin');
    else {
      console.log('BACKUP:SUCCESS:written successfully');
    }
  });
  lastContactsCount = contactsCache.length;
}

app.use(basicAuth(config.auth.user, config.auth.password));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(logger('common'));
app.use(express.static(__dirname + '/public'));

app.get('/', homeView);

function homeView(req, res, err) {
  err = 'There was an error submitting data for Dave Justice try submitting that one again. If the problem continues contact davejustishh@gmail.com';
  res.render('customers', {error: err,
                           customers: contactsCache});
}

app.post('/new', function(req, res) {
  db.update(req.body, function(err) {
    if (err) {
      console.error('DB:ERROR writing ', req.body, ' to database. !!! ', err);
      homeView(req, res, 'There was an error submitting data for ' + req.body.firstName + ' ' + req.body.lastName,
               ' try submitting that one again. If the problem continues contact davejustishh@gmail.com');
    }
    else {
      console.log('DB:SUCCESS writing', req.body, ' to database.');
      contactsCache.push(req.body);
      res.redirect('/');
    }
  });
});

app.listen(config.port, function () {
  console.log('Example app listening on port ' + config.port);
});
