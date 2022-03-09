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

const config = require('./lib/config/configProvider.js');
const {buildPublicConfig} = require('./lib/config/publicConfigProvider.js');
buildPublicConfig(config);
const EP = config.public.endpoints;


const logger = new Log('Tutorial');
let loggedUsers = {
    tokenToUserData: {},
}

const httpServer = new HttpServer(config.http, config.jwt);
console.log("ip address: " + httpServer.ipAddress);

httpServer.addStaticPath('./public');
httpServer.addStaticPath('./public', '/login');

httpServer.addStaticPath('./node_modules/less/dist', '/scripts');

const DatabaseService = require('./lib/DatabaseService.js');
const databaseService = new DatabaseService(loggedUsers, logger);
httpServer.post(EP.login, (req, res) => databaseService.login(req, res));
httpServer.post(EP.logout, (req, res) => databaseService.logout(req, res));
httpServer.get(EP.rctData + ':page/', (req, res) => databaseService.execDataReq(req, res));
httpServer.get(EP.rctData + ':page/:index/', (req, res) => databaseService.execDataReq(req, res));
httpServer.post(EP.insertData, (req, res) => databaseService.execDataInsert(req, res));
httpServer.get(EP.date, (req, res) => databaseService.getDate(req, res));


const AuthControlManager = require('./lib/AuthControlManager.js');
const authControlManager = new AuthControlManager(httpServer, loggedUsers, logger);
authControlManager.bindToTokenControl(EP.authControl);
