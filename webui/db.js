const {Client} = require('pg');
//TODO everywhere? add handling error when client unexpectedly disconnect;

async function select(client, command) {
    const res = await client.query(command);
    return res;
}

class PGCommunicator {
    constructor(httpserver, loggedUsers, log) {
        console.assert(httpserver !== null);
        console.assert(loggedUsers != null);

        this.loggedUsers = loggedUsers;
        this.httpserver = httpserver;
        this.log = log;
    }

    #login(req, res) {
        const body = req.body;
        console.log('user try to log in' + body);


        const client = new Client({
            user: body.username,
            host: 'localhost',
            database: body.dbname,
            password: body.password,
            port: 5432,
        });

        (async () => await client.connect())();
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


    #doQuery(req, res, query=null) {
        console.log(req.query);
        const client = this.loggedUsers.tokenToUserData[req.query.token].pgClient;

        if (client) {
            const body = req.body;
            if (query === null)
                query = body.sqlQuery;
            if (this.#verifysqlQuery(query)) {
                select(client, query)
                    .then((dbRes) => {
                        res.json({type: 'res', data: {fields: dbRes.fields, rows: dbRes.rows}});
                    }).catch(e => {
                        console.log(e);
                        res.json({type: 'err', data: e.code});
                })
            } else {
                res.json('This query is malicious');
            }
        } else {
            console.log('invalid token or no such client');
            res.json({type: 'err', data: 'invalid token or no such user'});
        }
    }

    #getRCTHomepage(req, res) {
       this.#doQuery(req, res, 'SELECT * from periods;');
    }



    bindLogging(name) {
        this.httpserver.post(name, (req, res) => this.#login(req, res));
    }
    bindLogout(name) {
        this.httpserver.post(name, (req, res) => this.#logout(req, res));
    }
    bindRCTHomepage(name) {
        this.httpserver.get(name, (req, res) => this.#getRCTHomepage(req, res));
    }

}

module.exports = PGCommunicator;