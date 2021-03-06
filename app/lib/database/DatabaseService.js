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
const { Client } = require('pg');
const QueryBuilder = require('./QueryBuilder.js');
const config = require('./../config/configProvider.js');

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
        this.queryBuilder = new QueryBuilder();
    }

    async login(req, res) {
        const { body } = req;
        let client = this.loggedUsers.tokenToUserData[req.query.token];

        if (!client) {
            this.logger.info('Logging new client: ');
            client = new Client(config.database);

            await client.connect()
                .catch((e) => {
                    this.logger.error(e);
                });
        } else {
            this.logger.info('Restoring session with client');
        }

        client.query('SELECT NOW();')
            .then(async (dbRes) => {
                await res.json({ data: dbRes.rows });
                this.loggedUsers.tokenToUserData[req.query.token] = {
                    pgClient: client,
                    loginDate: new Date(),
                    name: body.username,
                    lastReqTime: new Date(),
                };
                this.logger.info('Logged client: ');
            }).catch((e) => {
                this.responseWithStatus(res, 401, e.code);
            });
    }

    async logout(req, res) {
        const { token } = req.query;
        const clientData = this.loggedUsers.tokenToUserData[token];
        if (clientData) {
            this.loggedUsers.tokenToUserData[token] = undefined;
            clientData.pgClient.end((e) => {
                this.logger.error(e);
            });
        }
        if (clientData) {
            this.responseWithStatus(res, 200, 'successfully logout');
        } else {
            this.responseWithStatus(res, 409, 'no such user');
        }
    }

    buildQuery(params) {
        return this.queryBuilder.build(params) ;
    }

    async exec(req, res, dbResponseHandler, query = null) {
        const userData = this.loggedUsers.tokenToUserData[req.query.token];
        if (!userData) {
            const mess = 'ARR... probably user send request for data before server processed its login';
            this.logger.error(mess, req.query);
            this.responseWithStatus(res, 500, mess);
            return;
        }
        const client = userData.pgClient;

        if (client) {
            if (query === null) {
                query = this.buildQuery({ ...req.query, ...req.params });
            }

            client.query(query)
                .then((dbRes) => {
                    dbResponseHandler(req, res, dbRes);
                })
                .catch((e) => {
                    this.logger.error(e);
                    res.json({ data: e.code });
                });
        } else {
            this.responseWithStatus(res, 401, 'no user with such token');
        }
    }

    async execDataReq(req, res, query = null) {
        const dbResponseHandler = (req, res, dbRes) => {
            const { fields } = dbRes;
            let { rows } = dbRes;
            const data = {};

            if (req.query[DRP.countRecords] === 'true') {
                data[DRF.totalRowsCount] = rows.length;
                const offset = req.query[DRP.rowsOnSite] * (req.query[DRP.site] - 1);
                const limit = req.query[DRP.rowsOnSite];
                rows = rows.slice(offset, offset + limit);
            }

            data[DRF.rows] = rows;
            data[DRF.fields] = fields;

            res.json({ data: data });
        };

        await this.exec(req, res, dbResponseHandler, query);
    }

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
        this.logger.error(message);
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

        await this.adminClient.connect()
            .catch((e) => {
                this.logger.error("error when trying to establish admin connection", e);
                // process.emit('SIGINT');
            });
    }
}

module.exports = DatabaseService;
