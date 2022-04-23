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
const { buildPublicConfig } = require('./lib/config/publicConfigProvider.js');
const AuthControlManager = require('./lib/other/AuthControlManager.js');
const DatabaseService = require('./lib/database/DatabaseService.js');
const path = require('path');
const BookkeepingService = require('./lib/alimonitor-services/BookkeepingService.js');

const EP = config.public.endpoints;
Log.configure(config);

/**
 * RunConditionTable application
 */
class RunConditionTableApplication {
    constructor() {
        this.loggedUsers = {
            tokenToUserData: {},
        };
        this.logger = new Log(RunConditionTableApplication.name);
        this.httpServer = new HttpServer(config.http, config.jwt);
        this.databaseService = new DatabaseService(this.loggedUsers);
        this.bookkeepingService = new BookkeepingService();

        this.defineStaticRoutes();
        this.defineEndpoints();
        this.buildAuthControl();

        buildPublicConfig(config);
    }

    defineStaticRoutes() {
        const { httpServer } = this;

        httpServer.addStaticPath(path.join(__dirname, 'public'));
        httpServer.addStaticPath(path.join(__dirname, 'public'), '/login');
        httpServer.addStaticPath(path.join(__dirname, '..', 'node_modules', 'less/dist'), '/scripts');
    }

    defineEndpoints() {
        const { httpServer } = this;
        const { databaseService } = this;

        httpServer.post(EP.login, (req, res) => databaseService.login(req, res));
        httpServer.post(EP.logout, (req, res) => databaseService.logout(req, res));
        httpServer.get(EP.rctData, (req, res) => databaseService.execDataReq(req, res));
        httpServer.post(EP.insertData, (req, res) => databaseService.execDataInsert(req, res));
        httpServer.get(EP.date, (req, res) => databaseService.getDate(req, res));
    }

    buildAuthControl() {
        this.authControlManager = new AuthControlManager(this.httpServer);
        this.authControlManager.bindToTokenControl(EP.authControl);
    }

    async run() {
        this.logger.info('Starting RCT app...');

        try {
            await this.databaseService.setAdminConnection();
            await this.bookkeepingService.setupConnection();
            this.bookkeepingService.setSyncRunsTask();
            await this.httpServer.listen();
        } catch (error) {
            this.logger.error(`Error while starting RCT app: ${error}`);
            await this.stop();
            return Promise.reject(error);
        }

        this.logger.info('RCT app started');
    }

    async stop() {
        this.logger.info('Stopping RCT app...');

        const errHandler = (e) => this.logger.error(`Error while stopping RCT app: ${e}`);
        try {
            await this.databaseService.disconnect()
                .catch(errHandler);
            await this.bookkeepingService.close()
                .catch(errHandler);
            await this.httpServer.close();
        } catch (err) {
            this.logger.error(errHandler(err));
            return Promise.reject(err);
        }

        this.logger.info('RCT app stopped');
    }

    isInTestMode() {
        return process.env.ENV_MODE === 'test';
    }

    isInDevMode() {
        return process.env.ENV_MODE === 'dev';
    }

    isInProdMode() {
        return process.env.ENV_MODE === 'prod';
    }

    getEnvMode() {
        return process.env.ENV_MODE;
    }

    getAddress() {
        return this.httpServer.address();
    }
}

module.exports = RunConditionTableApplication;
