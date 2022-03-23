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
const AuthControlManager = require('./lib/AuthControlManager.js');
const DatabaseService = require('./lib/DatabaseService.js');
const EP = config.public.endpoints;


class RunConditionTableApplication {
    constructor () {
        this.loggedUsers = {
            tokenToUserData: {},
        }
        this.logger = Log('RCT-application')
        this.httpServer = new HttpServer(config.http, config.jwt);
        this.databaseService = new DatabaseService(loggedUsers, logger);

        this.defineStaticRoutes();
        this.defineEndpoints()
        this.buildAuthControl();

        buildPublicConfig(config);
    }


    defineStaticRoutes() {
        httpServer = this.httpServer;

        httpServer.addStaticPath('./public');
        httpServer.addStaticPath('./public', '/login');
        httpServer.addStaticPath('./node_modules/less/dist', '/scripts');
    }

    defineEndpoints() {
        const httpServer = this.httpServer;
        const databaseService = this.databaseService;

        httpServer.post(EP.login, (req, res) => databaseService.login(req, res));
        httpServer.post(EP.logout, (req, res) => databaseService.logout(req, res));
        httpServer.get(EP.rctData + ':page/', (req, res) => databaseService.execDataReq(req, res));
        httpServer.get(EP.rctData + ':page/:index/', (req, res) => databaseService.execDataReq(req, res));
        httpServer.post(EP.insertData, (req, res) => databaseService.execDataInsert(req, res));
        httpServer.get(EP.date, (req, res) => databaseService.getDate(req, res));
    }


    buildAuthControl() {
        this.authControlManager = new AuthControlManager(httpServer, loggedUsers, logger);
        authControlManager.bindToTokenControl(EP.authControl);
    }

    isInTestMode() {
        return process.env.NODE_ENV === 'test';
    }


    getAddress() {
        return this.httpServer.address();
    }


    async run() {
        this.logger.info('Starting RCT app...');

        try {
            // await this.databaseService.start();
            // await this.servicesSync.start();
            await this.httpServer.listen();
        } catch (error) {
            this.logger.error(`Error while starting RCT app: ${error}`);
            return Promise.reject(error);
        }

        this.logger.info('RCT app started');
    }

    async stop() {
        this.logger.info('Stopping RCT app...');

        try {
            // await this.databaseService.stop();
            // await this.servicesSync.stop();
            await this.httpServer.close();
        } catch (error) {
            this.logger.error(`Error while stopping RCT app: ${error}`);
            return Promise.reject(error);
        }

        this.logger.info('RCT app stopped');
    }
}

module.export = RunConditionTableApplication;