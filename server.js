const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mailgun = require('mailgun-js');
var cors = require('cors');

const app = express();

const port = process.env.PORT || '3001';

const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

app.use(bodyParser.json());
app.use(cors());

app.post('/api/send-email', async function (req, res) {
  const DOMAIN = 'sandboxb421c1230eb043b39ab33d4bb2fa7d81.mailgun.org';
  const mg = mailgun({
    apiKey: '57e7252250b4ecc529a4d08a1e49eae6-a3c55839-51f3e650',
    domain: DOMAIN,
  });
  const data = {
    from: 'No-Reply <no-reply@example.com>',
    to: req.body.receivers[0],
    subject: req.body.subject,
    html: req.body.message,
  };

  mg.messages().send(data, function (error, body) {
    console.log(body);
  });

  res.send({ messages: 'Send email success.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Server is up on port', port);
});
