const { HttpServer } = require('@aliceo2/web-ui');
const config = require('./config.js');
const httpServer = new HttpServer(config.http, config.jwt);

httpServer.addStaticPath('./public');
