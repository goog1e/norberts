var crypto = require('crypto');
var levelup = require('level');
var db = levelup('./db', {valueEncoding: 'json'});

module.exports = {
  update: update,
  getContacts: getContacts
};

function update(entry, cb) {
  var key = getHash(JSON.stringify(entry));
  db.put(key, entry, cb);
}

function getContacts(cb) {
  var contacts = [];
  db.createValueStream()
    .on('data', function (data) {
      contacts.push(data);
    })
    .on('end', function() {
      cb(contacts);
    });
}

function getHash(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}
