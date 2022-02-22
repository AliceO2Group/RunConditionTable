#!/usr/bin/env node
'use strict';

var https = require('https');
var port = process.argv[2] || 8043;
var fs = require('fs');
var path = require('path');
var server;
var options = {
      key: fs.readFileSync(path.join(__dirname, 'certs', 'server', 'privkey.pem'))
    , cert: fs.readFileSync(path.join(__dirname, 'certs', 'server', 'fullchain.pem'))
    };

function app(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, encrypted world!');
}

server = https.createServer(options, app).listen(port, function () {
  console.log(`Listening on: https://127.0.01:${server.address().port}`);
});
