/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

const { HttpServer, Log } = require('@aliceo2/web-ui');

const applicationProperties = require('./public/applicationProperties.json');
const EndP = applicationProperties.endpoints;
const methods = applicationProperties.methods;

const config = require('./lib/config/configProvider.js');
const {buildPublicConfig} = require('./lib/config/publicConfigProvider.js');

// -------------------------------------------------------

buildPublicConfig(config);

config.http.iframeCsp = (config?.grafana?.url) ? [ config.grafana.url ] : [];

const log = new Log('Tutorial');
let loggedUsers = {
    tokenToUserData: {},
}

const httpServer = new HttpServer(config.http, config.jwt);
console.log("ip address: " + httpServer.ipAddress);

httpServer.addStaticPath('./public');
httpServer.addStaticPath('./public', '/login');

httpServer.addStaticPath('./node_modules/less/dist', '/scripts');

const DatabaseService = require('./lib/DatabaseService.js');
const databaseService = new DatabaseService(loggedUsers, log);
httpServer.post(EndP.login, (req, res) => databaseService.login(req, res));
httpServer.post(EndP.logout, (req, res) => databaseService.logout(req, res));
httpServer.get(EndP.rctData, (req, res) => databaseService.execDataReq(req, res));
httpServer.post(EndP.insertData, (req, res) => databaseService.execDataInsert(req, res));
httpServer.get(EndP.date, (req, res) => databaseService.getDate(req, res));


const AuthControlManager = require('./lib/AuthControlManager.js');
const authControlManager = new AuthControlManager(httpServer, loggedUsers, log);
authControlManager.bindToTokenControl(EndP.authControl);

const BookkeepingService = require('./lib/BookkeepingService.js');
const bookkeepingService = new BookkeepingService();

const runs = bookkeepingService.getRuns();
console.log(runs);
