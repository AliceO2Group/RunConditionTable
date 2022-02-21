#!/usr/bin/env node
'use strict';

var https = require('https');
var fs = require('fs');
var path = require('path');
var ca = fs.readFileSync(path.join(__dirname, 'certs', 'client', 'chain.pem'));
var port = process.argv[2] || 8043;
var hostname = process.argv[3] || 'localhost.daplie.com';

var options = {
  host: hostname
, port: port
, path: '/'
, ca: ca
};
options.agent = new https.Agent(options);

https.request(options, function(res) {
  res.pipe(process.stdout);
}).end();
