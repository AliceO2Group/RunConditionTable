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
const alimonitorServices = require('./lib/alimonitor-services');
// Database
const { databaseManager } = require('./lib/database/DatabaseManager.js');
const { databaseService } = require('./lib/database/DatabaseService.js');

// Server
const { webUiServer } = require('./lib/server/WebUiServer.js');
const { isInDevMode, isInTestMode } = require('./lib/utils/env-utils.js');

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
        this.databaseService = databaseService;
        this.databaseManager = databaseManager;
        this.syncManager = alimonitorServices.syncManager;
        this.defineEndpoints();

        buildPublicConfig(config);
    }

    defineEndpoints() {
        const { httpServer } = this;
        const { databaseService } = this;

        httpServer.post(EP.login, (req, res) => databaseService.loginSession(req, res));
        httpServer.post(EP.logout, (req, res) => databaseService.logoutSession(req, res));
        httpServer.get(EP.rctData, (req, res) => databaseService.pgExecFetchData(req, res), { public: isInDevMode() || isInTestMode() });
        httpServer.post(EP.insertData, (req, res) => databaseService.pgExecDataInsert(req, res), { public: isInDevMode() || isInTestMode() });
        httpServer.get(EP.sync, async (_req, _res) => this.syncManager.syncAll());
    }

    async restart() {
        await this.stop();
        await this.run();
    }

    async run() {
        this.logger.info('Starting RCT app...');
        try {
            await this.databaseManager.migrate();
            await this.httpServer.listen();
            await this.databaseService.healthcheckInsertData();
            if (config.syncTaskAtStart) {
                this.syncManager.setSyncAllTask();
            }
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
                await this.syncManager.clearSyncAllTask();
            } catch (error) {
                this.logger.error(`Error while stopping RCT app: ${error}`);
            }
        } else {
            this.logger.info('Stopping already...');
        }
    }

    get httpServer() {
        return this.webUiServer.httpServer;
    }
}

module.exports = new RunConditionTableApplication();
