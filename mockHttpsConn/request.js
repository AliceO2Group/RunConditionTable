const https = require('https');
const fs = require('fs');
const path = require('path');

const ca = fs.readFileSync(path.join(__dirname, 'certs', 'client', 'chain.pem'));

const options = {
  hostname: 'localhost',
  port: 8043,
  path: '/',
  method: 'GET',
  ca: ca
};


options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();