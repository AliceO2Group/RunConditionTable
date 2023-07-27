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
const { Pool } = require('pg');
const { PGQueryBuilder } = require('./utilities');
const config = require('./../config/configProvider.js');
const {distinct} = require('../utils')

const DRP = config.public.dataReqParams;
const DRF = config.public.dataResponseFields;

/**
 * This class handle communication with postgres database using 'pg' package
 * logging is handled here, because client log in as database user,
 * so backend must communicate with database in order to check client credentials
 */
class DatabaseService {
    constructor() {
        this.loggedUsers = {
            tokenToUserData: {},
        };

        this.logger = new Log(DatabaseService.name);
        this.buildPool();
    }

    buildPool() {
        config.database.idleTimeoutMillis = 2000;
        config.database.max = 20

        this.pool = new Pool(config.database)
        this.pool.on('remove', () => {
            // this.logger.info(`removing client, clients in pool: ${this.pool._clients.length}`);
        })
        this.pool.on('acquire', () => {
            // this.logger.info(`acquiring client, clients in pool: ${this.pool._clients.length}`);
        })
        this.pool.on('error', (e) => {
            this.logger.error(`database pg pool fatal error: ${e.stack}`);
        })
    }

    async loginSession(req, res) {
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

    async logoutSession(req, res) {
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

    async pgExec(query, connectErrorHandler, dbResponseHandler, dbResErrorHandler) {
        const client = await this.pool.connect().catch((e) => {
            if (connectErrorHandler) {
                connectErrorHandler(e);
            } else {
                throw e;
            }
        })

        return await client.query(query)
            .then((dbRes) => {
                if (dbResponseHandler) {
                    dbResponseHandler(dbRes);
                }
                client.release();
                return dbRes
            })
            .catch((e) => {
                if (dbResErrorHandler) {
                    dbResErrorHandler(e);
                } else {
                    throw e;
                }
                client.release();
            });
    }

    async pgExecFetchData(req, res) {
        const userData = this.loggedUsers.tokenToUserData[req.query.token];
        if (!userData) {
            const mess = 'SESSION_ERROR:: no user with such token';
            this.logger.error(mess, req.query);
            this.responseWithStatus(res, 400, mess);
            return;
        }

        
        const params = {...req.query, ...req.params}

        const connectErrorHandler = (connectErr) => {
            this.logger.error('Error acquiring client:: ' + connectErr.stack)
            this.responseWithStatus(res, 500, connectErr.message);
        }

        const dbResponseHandler = (dbRes) => {
            let { fields, rows } = dbRes;
            let data = {};

            if (req.query[DRP.countRecords] === 'true') {
                data[DRF.totalRowsCount] = rows.length;
                const offset = params[DRP.rowsOnSite] * (params[DRP.site] - 1);
                const limit = params[DRP.rowsOnSite];
                rows = rows.slice(offset, offset + limit);
            }

            data[DRF.rows] = rows;
            data[DRF.fields] = distinct(fields.map(f => f.name)).map(n => { return { name: n } });

            res.json({ data: data });
        };

        const dbResErrorHandler = (e) => {
            this.logger.error(e.message + ' :: ' + e.stack)
            this.responseWithStatus(res, 500, e.code);
        }

        try {
            const query = PGQueryBuilder.buildSelect(params);
            await this.pgExec(query, connectErrorHandler, dbResponseHandler, dbResErrorHandler);
        } catch (e) {
            this.logger.error(e.stack)
            this.responseWithStatus(res, 400, e)
        }
    }


    async pgExecDataInsert(req, res) {
        this.checkToken(req, res);
        const dbResponseHandler = (dbRes) => {
            return res.json({data: dbRes})
        }
        const dbResErrorHandler = (e) => {
            this.logger.error(e.message + ' :: ' + e.stack)
            this.responseWithStatus(res, 500, e.code);
        }
        const connectErrorHandler = (connectErr) => {
            this.logger.error('Error acquiring client:: ' + connectErr.stack)
            this.responseWithStatus(res, 500, connectErr.message);
        }
        
        try {
            await this.pgExec(
                PGQueryBuilder.buildInsert(params), 
                connectErrorHandler, 
                dbResponseHandler, 
                dbResErrorHandler);
        } catch (e) {
            this.logger.error(e.stack)
            this.responseWithStatus(res, 400, e)
        }
    }

    async getDate(req, res) {
        await this.pgExecFetchData(req, res, 'SELECT NOW();');
    }

    responseWithStatus(res, status, message) {
        res.status(status).json({ message: message });
    }

    async healthcheckInsertData() {
        for (const [d, def] of Object.entries(config.rctData.healthcheckQueries.checkStaticData)) {
            this.logger.info(`healthcheck : ${def.description}`);
            for (const q of def.query) {
                const logger = config.rctData.suppressHealthcheckLogs ? () => null : (e) => this.logger.error(e.stack)
                await this.pgExec(q, logger, null, logger)
            }
        }
    }


}

module.exports = {
    databaseService: new DatabaseService()
};
