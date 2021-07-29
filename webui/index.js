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

// Import the backend classes
const { HttpServer, Log } = require('@aliceo2/web-ui');

// Define configuration for JWT tokens and HTTP server
const config = require('./config.js');

// Get logger instance
const log = new Log('Tutorial');
let loggedUsers = {
    tokenToUserData: {},
}

// HTTP server
// Instanciate the HTTP server
const httpServer = new HttpServer(config.http, config.jwt);
console.log("ip address: " + httpServer.ipAddress);

// Server static content in public directory
httpServer.addStaticPath('./public');
httpServer.addStaticPath('./public', '/api/login/');

const PGcommunicator = require('./db.js');
const pgCommunicator = new PGcommunicator(httpServer, loggedUsers, log);
pgCommunicator.bindLogging('/login');
pgCommunicator.bindLogout('/logout');
pgCommunicator.bindRCTHomepage('/RCT-Data');
pgCommunicator.bindDate('/date');

const AuthControlManager = require('./AuthControlManager.js');
const authControlManager = new AuthControlManager(httpServer, loggedUsers, log);
authControlManager.bindToTokenControl('/auth-control');