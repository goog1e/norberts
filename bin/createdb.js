var db = require('../lib/db');
var stubData = require('../stub-data/contacts.json');

stubData.forEach(function(d) {
  db.update(d, function(err) {
    if (err) console.error('CREATEDB:ERROR: writing ', d, err);
    else {
      console.error('CREATEDB:SUCCESS: writing ', d);
    }
  });
});
