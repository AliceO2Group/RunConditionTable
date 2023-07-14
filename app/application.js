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
// RCT
const { Log } = require('@aliceo2/web-ui');
const config = require('./lib/config/configProvider.js');
const { buildPublicConfig } = require('./lib/config/publicConfigProvider.js');

// Services

// Database
const database = require('./lib/database');

// Server
const { webUiServer } = require('./lib/server');

// Extract important
const EP = config.public.endpoints;
Log.configure(config);

/**
 * RunConditionTable application
 */
class RunConditionTableApplication {
    constructor() {
        Log.configure(config.winston);

        this.logger = new Log(RunConditionTableApplication.name);

        this.webUiServer = webUiServer;
        this.databaseService = database.databaseService;
        this.defineEndpoints();

        buildPublicConfig(config);
        this.buildCli();
    }

    defineEndpoints() {
        const { httpServer } = this;
        const { databaseService } = this;

        httpServer.post(EP.login, (req, res) => databaseService.loginSession(req, res));
        httpServer.post(EP.logout, (req, res) => databaseService.logoutSession(req, res));
        httpServer.get(EP.rctData, (req, res) => databaseService.pgExecFetchData(req, res));
        httpServer.post(EP.insertData, (req, res) => databaseService.pgExecDataInsert(req, res));
        httpServer.get(EP.date, (req, res) => databaseService.getDate(req, res));
        httpServer.get(EP.sync, async (_req, _res) => this.syncAll());
    }

    async restart() {
        await this.stop();
        await this.run();
    }

    async run() {
        this.logger.info('Starting RCT app...');
        try {
            await this.httpServer.listen();
        } catch (error) {
            this.logger.error(`Error while starting RCT app: ${error}`);
            await this.stop();
        }
        this.logger.info('RCT app started');
    }

    async stop() {
        if (! this.isStopping) {
            this.isStopping = true;
            this.logger.info('Stopping RCT app...');
            try {
                await this.httpServer.close();
            } catch (error) {
                this.logger.error(`Error while stopping RCT app: ${error}`);
            }
            await this.clearSyncAllTask();
            await this.disconnectServices();
            this.rl.close();

            this.logger.info('RCT app stopped');
        } else {
            this.logger.info('Stopping already...');
        }
    }

    static isInTestMode() {
        return process.env.ENV_MODE === 'test';
    }

    static isInDevMode() {
        return process.env.ENV_MODE === 'development';
    }

    static getEnvMode() {
        return process.env.ENV_MODE;
    }

    get httpServer() {
        return this.webUiServer.httpServer;
    }
}

module.exports = new RunConditionTableApplication();
