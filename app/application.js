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
const readline = require('readline');
const Utils = require('./lib/Utils.js');

const { Console } = require('node:console');
const MonalisaService = require('./lib/alimonitor-services/MonalisaService.js');
const MonalisaServiceMC = require('./lib/alimonitor-services/MonalisaServiceMC.js');

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

        if (!config.openId) {
            this.httpServer = new HttpServer(config.http, config.jwt);
        } else {
            this.httpServer = new HttpServer(config.http, config.jwt, config.openId);
        }
        this.logger = new Log(RunConditionTableApplication.name);

        this.buildServices();
        this.defineStaticRoutes();
        this.defineEndpoints();
        this.buildAuthControl();

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

        this.con = new Console({ stdout: process.stdout, stderr: process.stderr });

        this.rl.on('line', (line) => this.cli(line));
    }

    cli(line) {
        try {
            const cmdAndArgs = line.trim().split(/ +/).map((s) => s.trim());
            Utils.switchCase(cmdAndArgs[0], {
                '': () => {},
                bk: (args) => this.servCLI(this.alimonitorServices.bookkeepingService, args),
                ml: (args) => this.servCLI(this.alimonitorServices.monalisaService, args),
                mc: (args) => this.servCLI(this.alimonitorServices.monalisaServiceMC, args),
                sync: async () => {
                    await this.bookkeepingService.setSyncTask();
                    await this.monalisaService.setSyncTask();
                    await this.monalisaServiceMC.setSyncTask();
                },
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
            loglev: () => serv.setLogginLevel(args[1]),
        }, this.incorrectCommand())();
    }

    incorrectCommand() {
        return () => this.con.log('incorrect command');
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

    buildServices() {
        this.databaseService = new DatabaseService(this.loggedUsers);

        const monalisaService = new MonalisaService();
        const monalisaServiceMC = new MonalisaServiceMC();
        this.alimonitorServices = {
            bookkeepingService: new BookkeepingService(),
            monalisaService: monalisaService,
            monalisaServiceDetails: monalisaService.monalisaServiceDetails,
            monalisaServiceMC: monalisaServiceMC,
            monalisaServiceMCDetails: monalisaServiceMC.monalisaServiceMCDetails,
        };
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

        this.logger.info('RCT app started');
    }

    async connectServices() {
        const errors = [];
        await this.databaseService.setAdminConnection()
            .catch((e) => errors.push(e));
        await Promise.all(
            Object.values(this.alimonitorServices)
                .map((serv) => serv.setupConnection()),
        ).catch((e) => errors.push(e));
        if (errors.length > 0) {
            this.logger.error(`Error while starting services: ${errors.map((e) => e.message).join(', ')}`);
        }
    }

    async stop() {
        this.logger.info('Stopping RCT app...');
        try {
            await this.httpServer.close();
        } catch (error) {
            this.logger.error(`Error while stopping RCT app: ${error}`);
            await this.stop();
        }
        await this.disconnectServices();

        this.logger.info('RCT app stopped');
    }

    async disconnectServices() {
        const errors = [];
        await this.databaseService.disconnect()
            .catch((e) => errors.push(e));
        await Promise.all(
            Object.values(this.alimonitorServices)
                .map((serv) => serv.close()),
        ).catch((e) => errors.push(e));
        if (errors.length > 0) {
            this.logger.error(`Error while starting services: ${errors.map((e) => e.message).join(', ')}`);
        }
    }

    isInTestMode() {
        return process.env.ENV_MODE === 'test';
    }

    isInDevMode() {
        return process.env.ENV_MODE === 'development';
    }

    isInProdMode() {
        return process.env.ENV_MODE === 'production';
    }

    getEnvMode() {
        return process.env.ENV_MODE;
    }

    getAddress() {
        return this.httpServer.address();
    }
}

module.exports = RunConditionTableApplication;
