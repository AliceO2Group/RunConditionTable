const {Client} = require('pg');
const ReqParser = require('./ReqParser.js');
const config = require('../config.js');
const applicationProperties = require('../public/applicationProperties.json');
const dataReqParams = applicationProperties.dataReqParams;
const dataRespondFields = applicationProperties.dataRespondFields;

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
    constructor(loggedUsers, log) {
        console.assert(loggedUsers != null);

        this.loggedUsers = loggedUsers;
        this.log = log;
        this.parser = new ReqParser();
    }

    login(req, res) {
        const body = req.body;
        console.log(body)
        let client = this.loggedUsers.tokenToUserData[req.query.token];

        if (!client) {
            client = new Client({
                user: body.username,
                host: config.database.hostname,
                database: body.dbname,
                password: body.password,
                port: config.database.port,
            });

            (async () => await client.connect())();
        }
        console.log("Logging client: ", client);

        select(client, 'SELECT NOW();')
            .then(async dbRes => {
                await res.json({data: dbRes.rows});
                this.loggedUsers.tokenToUserData[req.query.token] = {
                    pgClient: client,
                    loginDate: new Date(),
                }
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
                query = this.#parseReqToSql(req.query);

            console.log(new Date(), query);
            await select(client, query)
                .then((dbRes) => {dbResponseHandler(req, res, dbRes)})
                .catch(e => {
                    console.log(e);
                    res.json({data: e.code});
                })
        } else {
            this.responseWithStatus(res, 401,'invalid token or no such user')
        }
    }

    async execDataReq(req, res, query = null) {
        const dbResponseHandler = (req, res, dbRes) => {
            const fields = dbRes.fields;
            let rows = dbRes.rows;
            const data = {};
            console.log(req.query);
            if (req.query[dataReqParams.countRecords] === 'true') {
                data[dataRespondFields.totalRowsCount] = rows.length;
                const offset = req.query.rowsOnSite * (req.query.site - 1);
                const limit = req.query.rowsOnSite;
                rows = rows.slice(offset, offset + limit);
            }

            data[dataRespondFields.rows] = rows;
            data[dataRespondFields.fields] = fields;
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
        console.log(message);
        res.status(status).json({message: message})
    }

}

module.exports = DatabaseService;