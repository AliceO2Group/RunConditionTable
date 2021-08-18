
class AuthControlManager {
    constructor(httpserver, loggedUsers, log) {
        console.assert(httpserver !== null);
        console.assert(loggedUsers != null);

        this.loggedUsers = loggedUsers;
        this.httpserver = httpserver;
        this.log = log;
    }

    #tokenControl(req, res) {
        res.json({date: new Date()})
    }

    bindToTokenControl(name) {
        this.httpserver.post(name, (req, res) => this.#tokenControl(req, res))
    };

}

module.exports = AuthControlManager;