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

const { Log } = require('@aliceo2/web-ui');
const { Client, Pool } = require('pg');
const QueryBuilder = require('./QueryBuilder.js');
const config = require('./../config/configProvider.js');
const Utils = require('../Utils.js')
const DRP = config.public.dataReqParams;
const DRF = config.public.dataRespondFields;

/**
 * This class handle communication with postgres database using 'pg' package
 * logging is handled here, because client log in as database user,
 * so backend must communicate with database in order to check client credentials
 */
class DatabaseService {
    constructor(loggedUsers) {
        this.loggedUsers = loggedUsers;
        this.logger = new Log(DatabaseService.name);
        this.buildPool();
    }

    buildPool() {
        config.database.idleTimeoutMillis = 2000;
        config.database.max = 20

        this.pool = new Pool(config.database)
        this.pool.on('remove', (client) => {
            this.logger.info(`removing client, clients in pool: ${this.pool._clients.length}`);
        })
        this.pool.on('acquire', (client) => {
            this.logger.info(`acquiring client, clients in pool: ${this.pool._clients.length}`);
        })
        this.pool.on('error', (e) => {
            this.logger.error(`database pg pool fatal error: ${e.stack}`);
        })
    }

    async login(req, res) {
        const { body } = req;
        let userData = this.loggedUsers.tokenToUserData[req.query.token];
        if (!userData) {
            this.logger.info('Logging new client: ');
            userData = {
                loginDate: new Date(),
                name: body.username,
                lastReqTime: new Date(),
                token: req.query.token,
            };
            this.loggedUsers.tokenToUserData[req.query.token] = userData;
            this.responseWithStatus(res, 200, "logged");
        } else {
            this.logger.info(`Restoring session with client: ${userData}`);
            this.responseWithStatus(res, 200, "session restored");
        }
    }

    async logout(req, res) {
        const { token } = req.query;
        const userData = this.loggedUsers.tokenToUserData[token];
        if (userData) {
            this.loggedUsers.tokenToUserData[token] = undefined;
        }
        if (userData) {
            this.responseWithStatus(res, 200, 'successfully logout');
        } else {
            this.responseWithStatus(res, 409, 'not logged');
        }
    }

    async exec(req, res, dbResponseHandler, query = null) {
        const userData = this.loggedUsers.tokenToUserData[req.query.token];
        if (!userData) {
            const mess = 'SESSION_ERROR:: no user with such token';
            this.logger.error(mess, req.query);
            this.responseWithStatus(res, 400, mess);
            return;
        }

        if (query === null) {
            query = await QueryBuilder.build({ ...req.query, ...req.params });
        }

        this.pool.connect((connectErr, client, release) => {
        if (connectErr) {
            this.logger.error('Error acquiring client:: ' + connectErr.stack)
            this.responseWithStatus(res, 500, connectErr.message);
            return;
        }

        client.query(query)
            .then((dbRes) => {
                dbResponseHandler(req, res, dbRes);
            })
            .catch((e) => {
                this.logger.error(e.message + ' :: ' + e.stack)
                this.responseWithStatus(res, 500, e.code);
            });
        release();
        })

    }

    async execDataReq(req, res, query = null) {
        const dbResponseHandler = (req, res, dbRes) => {
            let { fields, rows } = dbRes;
            const data = {};

            if (req.query[DRP.countRecords] === 'true') {
                data[DRF.totalRowsCount] = rows.length;
                const offset = req.query[DRP.rowsOnSite] * (req.query[DRP.site] - 1);
                const limit = req.query[DRP.rowsOnSite];
                rows = rows.slice(offset, offset + limit);
            }

            data[DRF.rows] = rows;
            data[DRF.fields] = Utils.distinct(fields.map(f => f.name)).map(n => { return { name: n } });

            res.json({ data: data });
        };

        await this.exec(req, res, dbResponseHandler, query);
    }

    // dbResponseAdjuster(req, query, data) //TODO

    async execDataInsert(req, res, query = null) {
        if (query) {
            const dbResponseHandler = (req, res, _) => {
                res.json({ data: 'data inserted' });
            };
            await this.exec(req, res, dbResponseHandler, query);
        }
    }

    async getDate(req, res) {
        await this.execDataReq(req, res, 'SELECT NOW();');
    }

    responseWithStatus(res, status, message) {
        res.status(status).json({ message: message });
    }

    
    async disconnect() {
        const promises = Object.entries(this.loggedUsers.tokenToUserData).map(([_, data]) => {
            this.logger.info(`ending for ${data.name}`);
            return data.pgClient.end();
        });
        return Promise.all(promises.concat([this.adminClient.end()]));
    }

    async setAdminConnection() {
        this.adminClient = new Client(config.database);
        this.adminClient.on('error', (e) => this.logger.error(e));

        await this.adminClient.connect()
            .catch((e) => {
                this.logger.error(`error when trying to establish admin connection with ${config.database.host}`, e);
            });
    }
}

module.exports = DatabaseService;
