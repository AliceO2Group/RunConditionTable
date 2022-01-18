/**
 * class responsible for checking if token expired
 */
class AuthControlManager {
    constructor(httpserver, loggedUsers, log) {
        this.loggedUsers = loggedUsers;
        this.httpserver = httpserver;
        this.log = log;
    }

    #tokenControl(req, res) {
        res.json({date: new Date()})
    }

    bindToTokenControl(name) {
        this.httpserver.get(name, (req, res) => this.#tokenControl(req, res))
    };

}

module.exports = AuthControlManager;