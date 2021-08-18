const {Client} = require('pg');
//TODO everywhere? add handling error when client unexpectedly disconnect;
//TODO removing clients;

//TODO often token expire unexpectedly to fast;

async function select(client, command) {
    const res = await client.query(command);
    return res;
}

class PgManager {
    constructor(httpserver, loggedUsers, log) {
        console.assert(httpserver !== null);
        console.assert(loggedUsers != null);

        this.loggedUsers = loggedUsers;
        this.httpserver = httpserver;
        this.log = log;
    }

    #login(req, res) {
        const body = req.body;
        console.log('user try to log in ', body);


        var client = this.loggedUsers.tokenToUserData[req.query.token];
        console.log(client);
        if (client === undefined || client === null) {
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
            .then(async sqlRes => {
                res.json({type: 'res', data: sqlRes.rows});
                this.loggedUsers.tokenToUserData[req.query.token] = {
                        pgClient: client,
                        loginDate: new Date(),
                    }
                console.log(this.loggedUsers);
            }).catch(e => {
                res.json({type: 'err', data: e.code})
        });
    }
    #logout(req, res) {
        let found = false
        if (this.loggedUsers.tokenToUserData[req.query.token]) {
            found = true;
            this.loggedUsers.tokenToUserData[req.query.token] = null;
        }
        if (found) {
            res.json({type: 'res', data: 'OK'});
        } else {
            res.json({type: 'err', data: 'NOUSER'});
        }
    }

    #verifysqlQuery(query) {
        // TODO To handling hacking;
        return true;
    }

    #parseReqQToSqlQ(query) {
        switch (query.view) {
            case 'periods': return`SELECT * FROM ${query.view} LIMIT ${query.rowsOnSite} OFFSET ${query.rowsOnSite * (query.site - 1)};`;
            case 'mc': return`SELECT * FROM ${query.view} LIMIT ${query.rowsOnSite} OFFSET ${query.rowsOnSite * (query.site - 1)};`;
            case 'runs': return `SELECT * FROM ${query.view} WHERE period_id = (SELECT id FROM periods WHERE periods.period = '${query.period}') LIMIT ${query.rowsOnSite} OFFSET ${query.rowsOnSite * (query.site - 1)};`;
            default: return 'SELECT NOW()';
        }
    }


    async #execDataReq(req, res, query=null) {
        if (this.loggedUsers.tokenToUserData[req.query.token]) {
            const client = this.loggedUsers.tokenToUserData[req.query.token].pgClient;
            if (query === null) {
                query = this.#parseReqQToSqlQ(req.query);
            }
            console.log(new Date(), query);
            if (client) {
                if (this.#verifysqlQuery(query)) {
                    await select(client, query)
                        .then((dbRes) => {
                            res.json({type: 'res', data: {fields: dbRes.fields, rows: dbRes.rows}});
                        }).catch(e => {
                        console.log(e);
                        res.json({type: 'err', data: e.code});
                    })
                } else {
                    res.json(req, query, 'This query is malicious');
                }
            } else {
                console.log('invalid token or no such client');
                res.json({type: 'err', data: 'invalid token or no such user'});
            }
        } else {
            console.log('invalid token or no such client');
            res.json({type: 'err', data: 'invalid token or no such user'});
        }
    }


    async #getDate(req, res) {
        await this.#execDataReq(req, res, 'SELECT NOW();')
    }

    bindLogging(name) {
        this.httpserver.post(name, (req, res) => this.#login(req, res));
    }
    bindLogout(name) {
        this.httpserver.post(name, (req, res) => this.#logout(req, res));
    }
    bindGetDbData(name) {
        this.httpserver.get(name, (req, res) => this.#execDataReq(req, res));
    }

    bindDate(name) {
        this.httpserver.get(name, (req, res) => this.#getDate(req, res));
    }

}

module.exports = PgManager;