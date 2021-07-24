const {Client} = require('pg');

async function select(client, command) {
    await client.connect();
    const res = await client.query(command);
    await client.end();
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
        // console.log(req);
        console.log('user try to log in' + body);
        const client = new Client({
            user: body.username,
            host: 'localhost',
            database: body.dbname,
            password: body.password,
            port: 5432,
        });

        select(client, 'SELECT NOW();')
            .then(sqlRes => {
                res.json({type: 'res', id: this.loggedUsers.lastID, data: sqlRes.rows});
                this.loggedUsers.list.push({
                    id: this.loggedUsers.lastID,
                    username: body.username,
                    date: new Date(),
                    token: req.query.token})
                this.loggedUsers.lastID ++;
            }).catch(e => {
            // console.log(e.message);
            res.json({type: 'err', data: e.code})
        });
    }
    #logout(req, res) {
        const body = req.body;
        console.log('Try to log out: ' + body.username + ", id: " + body.id);
        // console.log(req);
        let found = false
        this.loggedUsers.list = this.loggedUsers.list.filter(item => {
            const cond = !(item.id === body.id
                && item.username === body.username
                && item.token === req.query.token)
            if (!cond) found = true;
            return cond;
        });
        if (found) {
            res.json({type: 'res', data: 'OK'});
        } else {
            res.json({type: 'err', data: 'NOUSER'});
        }
    }
    #RCTHomepage(req, res) {

        const body = req.body;
        // console.log(req);
        console.log('user try to log in' + body);
        const client = new Client({
            user: body.username,
            host: 'localhost',
            database: body.dbname,
            password: body.password,
            port: 5432,
        });

        select(client, 'SELECT * from periods;')
            .then(sqlRes => {
                // console.log(sqlRes.rows)
                res.json({type: 'res', data: sqlRes.rows});
            }).catch(e => {
            // console.log(e.message);
            res.json({type: 'err', data: e.code});
        })
    }

    bindLogging(name) {
        this.httpserver.post(name, (req, res) => this.#login(req, res));
    }
    bindLogout(name) {
        this.httpserver.post(name, (req, res) => this.#logout(res, res));
    }
    bindRCTHomepage(name) {
        this.httpserver.post(name, (req, res) => this.#RCTHomepage(req, res));
    }

}

module.exports = PGCommunicator;