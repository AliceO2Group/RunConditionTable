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


const {Client} = require('pg');
const ReqParser = require('./ReqParser.js');
const config = require('./config/configProvider.js');
const {Log} = require("@aliceo2/web-ui");
const DRP = config.public.dataReqParams;
const DRF = config.public.dataRespondFields;

//TODO removing clients;

async function select(client, command) {
    return await client.query(command);
}

/**
 * this class handle communication with postgres database using 'pg' package
 * logging is handled here, because client log in as database user,
 * so backend must communicate with database in order to check client credentials
 */

class DatabaseService {
    constructor(loggedUsers) {
        console.assert(loggedUsers != null);

        this.loggedUsers = loggedUsers;
        this.logger = new Log();
        this.parser = new ReqParser();
    }

    login(req, res) {
        const body = req.body;
        let client = this.loggedUsers.tokenToUserData[req.query.token];

        if (!client) {
            client = new Client({
                host: config.database.hostname,
                port: config.database.port,
                database: config.database.dbname,
                user: config.database.dbuser,
                password: body.password,
            });

            (async () => await client.connect())();
        }
        this.logger.info("Logging client: ", );

        select(client, 'SELECT NOW();')
            .then(async dbRes => {
                await res.json({data: dbRes.rows});
                this.loggedUsers.tokenToUserData[req.query.token] = {
                    pgClient: client,
                    loginDate: new Date(),
                    name: body.username
                }
                this.logger.info("Logged client: ", );
            }).catch(e => {
            this.responseWithStatus(res, 401, e.code);
        });
    }

    logout(req, res) {
        let found = false
        if (this.loggedUsers.tokenToUserData[req.query.token]) {
            found = true;
            this.loggedUsers.tokenToUserData[req.query.token] = null;
        }
        if (found) {
            this.responseWithStatus(res, 200, 'successfully logout');
        } else {
            this.responseWithStatus(res, 409, 'no such user')
        }
    }


    #parseReqToSql(query) {
        return this.parser.parseDataReq(query) ;
    }

    async #exec(req, res, dbResponseHandler, query=null) {
        const userData = this.loggedUsers.tokenToUserData[req.query.token]
        if (!userData) {
            const mess = 'ARR... probably user send request for data before server processed its login';
            console.error(mess, req.query)
            this.responseWithStatus(res, 500, mess)
            return;
        }
        const client = userData.pgClient;

        if (client) {
            if (query === null)
                query = this.#parseReqToSql({...req.query, ...req.params});

            console.log(new Date(), query);
            await select(client, query)
                .then((dbRes) => {dbResponseHandler(req, res, dbRes)})
                .catch(e => {
                    console.log(e);
                    res.json({data: e.code});
                })
        } else {
            this.responseWithStatus(res, 401,'no user with such token')
        }
    }

    async execDataReq(req, res, query = null) {
        const dbResponseHandler = (req, res, dbRes) => {
            const fields = dbRes.fields;
            let rows = dbRes.rows;
            const data = {};

            if (req.query[DRP.countRecords] === 'true') {
                data[DRF.totalRowsCount] = rows.length;
                const offset = req.query[DRP.rowsOnSite] * (req.query[DRP.site] - 1);
                const limit = req.query[DRP.rowsOnSite];
                rows = rows.slice(offset, offset + limit);
            }

            data[DRF.rows] = rows;
            data[DRF.fields] = fields;

            res.json({data: data});
        }

        await this.#exec(req, res, dbResponseHandler, query)
    }

    async execDataInsert(req, res, query=null) {
        const dbResponseHandler = (req, res, dbRes) => {
            res.json({data: 'data inserted'});
        }
        if (!query)
            query = this.parser.parseInsertDataReq(req.body.payload)

        await this.#exec(req, res, dbResponseHandler, query)
    }


    async getDate(req, res) {
        await this.execDataReq(req, res, 'SELECT NOW();')
    }

    responseWithStatus(res, status, message) {
        this.logger.error(message);
        res.status(status).json({message: message})
    }

    async insertBookkeepingRuns(req, res, runs) {
        console.log(runs);
    }

}

module.exports = DatabaseService;