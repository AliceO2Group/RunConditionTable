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

// IO
const readline = require('readline');
const Utils = require('./lib/utils');
const { Console } = require('node:console');

// Services
const services = require('./lib/alimonitor-services');

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
        this.services = services;
        this.defineEndpoints();

        buildPublicConfig(config);
        this.buildCli();
    }

    buildCli() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
            prompt: '==> ',
        });
        this.rl.on('line', (line) => this.devCli(line));
        this.con = new Console({ stdout: process.stdout, stderr: process.stderr });
    }

    devCli(line) {
        try {
            const cmdAndArgs = line.trim().split(/ +/).map((s) => s.trim());
            const dbAdminExec = (args) => {
                this.databaseService.adminClient
                    .query(args.join(' '))
                    .then(this.con.log)
                    .catch((e) => {
                        this.con.log(e);
                    });
            };
            const shExec = (args) => {
                Utils.exec(args)
                    .then(this.con.log)
                    .catch((e) => {
                        this.con.log(e);
                    });
            };
            Utils.switchCase(cmdAndArgs[0], {
                '': () => {},
                hc: () => this.databaseService.healthcheckInsertData(),
                users: () => {
                    this.con.log(this.databaseService.loggedUsers);
                },
                pool: () => {
                    this.con.log(this.databaseService.pool);
                },
                now: () => {
                    dbAdminExec(['select now();']);
                },
                psql: dbAdminExec,
                sh: shExec,
                bk: (args) => this.servCLI(this.services.bookkeepingService, args),
                ml: (args) => this.servCLI(this.services.monalisaService, args),
                mc: (args) => this.servCLI(this.services.monalisaServiceMC, args),
                sync: () => this.syncAll(),
                connServ: async () => {
                    await this.connectServices();
                },
                app: (args) => this.applicationCli(args),
            }, this.incorrectCommand())(cmdAndArgs.slice(1));
            this.rl.prompt();
        } catch (error) {
            this.con.error(error.message);
        }
    }

    applicationCli(args) {
        Utils.switchCase(args[0], {
            stop: () => this.stop(),
            run: () => this.run(),
        }, this.incorrectCommand())();
    }

    servCLI(serv, args) {
        Utils.switchCase(args[0], {
            state: () => this.con.log(args[1] ? serv?.[args[1]] : serv),
            stop: () => serv.clearSyncTask(),
            start: () => serv.setSyncTask(),
            logdepth: () => serv.setLogginLevel(args[1]),
        }, this.incorrectCommand())();
    }

    incorrectCommand() {
        return () => this.con.log('incorrect command');
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

    async syncAll() {
        await this.services.bookkeepingService.setSyncTask();
        await this.services.monalisaService.setSyncTask();
        await this.services.monalisaServiceMC.setSyncTask();
    }

    async setSyncAllTask() {
        const syncPeriod = 12 * 60 * 60 * 1000; // Ones per day
        
        this.syncAllTask = setInterval(this.syncAll.bind(this), syncPeriod);
    }

    async clearSyncAllTask() {
        clearInterval(this.setSyncAllTask);
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

        await this.connectServices();
        if (config.syncTaskAtStart) {
            this.setSyncAllTask();
        }
        this.logger.info('RCT app started');
    }

    async connectServices() {
        const errors = [];
        await this.databaseService.healthcheckInsertData()
            .catch((e) => errors.push(e));
        await Promise.all(
            Object.values(this.services)
                .map((serv) => serv.dbConnect()),
        ).catch((e) => errors.push(e));
        if (errors.length > 0) {
            this.logger.error(`Error while starting services: ${errors.map((e) => e.message).join(', ')}`);
        }
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
            await this.disconnectServices();
            await this.clearSyncAllTask();
            this.rl.close();

            this.logger.info('RCT app stopped');
        } else {
            this.logger.info('Stopping already...');
        }
    }

    async disconnectServices() {
        const errors = [];
        await this.databaseService.disconnect()
            .catch((e) => errors.push(e));
        await Promise.all(
            Object.values(this.services)
                .map((serv) => serv.close()),
        ).catch((e) => errors.push(e));
        if (errors.length > 0) {
            this.logger.error(`Error while stopping services: ${errors.map((e) => e.message).join(', ')}`);
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
