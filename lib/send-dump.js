var nodemailer = require('nodemailer');
var config = require('../config.json');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: config.mail
});

function sendDump(user, contactCountDiff, dataDump) {
  var today = new Date().toDateString();
  var mailOptions = {
    from: 'Norbert\'s pizza customer app ✔ ' + config.admin,
    to: user,
    subject: '✔ Norbert\'s pizza weekly customer db dump ✔',
    text: 'Customer data dump for ' + today + ' attached. \n '+ contactCountDiff +' contacts added.',
    attachments: [
      {
        filename: 'customerdbdump_' + today + '.json',
        content: dataDump
      }
    ]
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) return console.log(err);
    return console.log('Message sent: ' + info.response);
  });
}

module.exports = {sendDump: sendDump}
