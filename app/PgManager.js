const {Client} = require('pg');
const ReqParser = require('./ReqParser.js');

//TODO removing clients;

async function select(client, command) {
    return await client.query(command);
}

/**
 * this class handle communication with postgres database using 'pg' package
 * logging is handled here, because client log in as database user,
 * so backend must communicate with database in order to check client credentials
 */
class PgManager {
    constructor(httpserver, loggedUsers, log) {
        console.assert(httpserver !== null);
        console.assert(loggedUsers != null);

        this.loggedUsers = loggedUsers;
        this.httpserver = httpserver;
        this.log = log;
        this.parser = new ReqParser();
    }

    #login(req, res) {
        const body = req.body;
        console.log(body)
        let client = this.loggedUsers.tokenToUserData[req.query.token];

        console.log(client);
        if (!client) {
            client = new Client({
                user: body.username,
                host: 'localhost',
                database: body.dbname,
                password: body.password,
                port: 5432,
            });

            (async () => await client.connect())();
        }
        select(client, 'SELECT NOW();')
            .then(async dbRes => {
                await res.json({data: dbRes.rows});
                this.loggedUsers.tokenToUserData[req.query.token] = {
                    pgClient: client,
                    loginDate: new Date(),
                }
            }).catch(e => {
            this.responseWithStatus(res, 401, JSON.stringify(e.code));
        });
    }

    // TODO here or in frontend behaves oddly
    #logout(req, res) {
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

    #verifySqlQuery(query) {
        // TODO To handling hacking;
        return true;
    }

    #parseReqQToSqlQ(query) {
        return this.parser.parseDataReq(query);
    }

    async #exec(req, res, dbResponseHandler, query=null) {
        const userData = this.loggedUsers.tokenToUserData[req.query.token]
        const client = userData.pgClient;

        if (userData && client) {
            if (query === null) {
                query = this.#parseReqQToSqlQ(req.query);
            }
            console.log(new Date(), query);

            if (this.#verifySqlQuery(query)) {
                await select(client, query)
                    .then((dbRes) => {dbResponseHandler(req, res, dbRes)})
                    .catch(e => {
                        console.log(e);
                        res.json({data: e.code});
                    })
            } else {
                res.json(req, query, 'This query is malicious');
            }

        } else {
            this.responseWithStatus(res, 401,'invalid token or no such user')
        }
    }

    async #execDataReq(req, res, query = null) {
        const dbResponseHandler = (req, res, dbRes) => {
            const fields = dbRes.fields;
            let rows = dbRes.rows;
            const data = {};
            console.log(req.query);
            if (req.query['count-records'] === 'true') {
                data['totalRecordsNumber'] = rows.length;
                const offset = req.query.rowsOnPage * (req.query.page - 1);
                const limit = req.query.rowsOnPage;
                rows = rows.slice(offset, offset + limit);
            }

            data['rows'] = rows;
            data['fields'] = fields;

            res.json({data: data});
        }
        await this.#exec(req, res, dbResponseHandler, query)
    }

    async #execDataInsert(req, res, query=null) {
        const dbResponseHandler = (req, res, dbRes) => {
            res.json({data: 'data inserted'});
        }
        if (!query) {
            query = this.parser.parseInsertDataReq(req.body.payload)
        }
        await this.#exec(req, res, dbResponseHandler, query)
    }


    async #getDate(req, res) {
        await this.#execDataReq(req, res, 'SELECT NOW();')
    }

    responseWithStatus(res, status, message) {
        console.log(message);
        res.status(status).json({message: message})
    }


    /**
     * methods below allow httpServer to bind methods above to particular endpoints
     */

    bindLogging(name) {
        this.httpserver.post(name, (req, res) => this.#login(req, res));
    }

    bindLogout(name) {
        this.httpserver.post(name, (req, res) => this.#logout(req, res));
    }

    bindGetDbData(name) {
        this.httpserver.get(name, (req, res) => this.#execDataReq(req, res));
    }

    bindInsertDbData(name) {
        this.httpserver.post(name, (req, res) => this.#execDataInsert(req, res));
    }

    bindDate(name) {
        this.httpserver.get(name, (req, res) => this.#getDate(req, res));
    }

}

module.exports = PgManager;