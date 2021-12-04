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

const config = require('./config.js');

const log = new Log('Tutorial');
let loggedUsers = {
    tokenToUserData: {},
}

const httpServer = new HttpServer(config.http, config.jwt);
console.log("ip address: " + httpServer.ipAddress);

httpServer.addStaticPath('./public');
httpServer.addStaticPath('./public', '/login');

httpServer.addStaticPath('./node_modules/less/dist', '/scripts');

const PgManager = require('./PgManager.js');
const pgManager = new PgManager(httpServer, loggedUsers, log);
pgManager.bindLogging('/login');
pgManager.bindLogout('/logout');
pgManager.bindGetDbData('/RCT-Data');
pgManager.bindDate('/date');
pgManager.bindInsertDbData('/Rct-Data/insert-data');

const AuthControlManager = require('./AuthControlManager.js');
const authControlManager = new AuthControlManager(httpServer, loggedUsers, log);
authControlManager.bindToTokenControl('/auth-control');