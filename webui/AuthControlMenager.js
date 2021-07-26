
class AuthControlMenager {
    constructor(httpserver, loggedUsers, log) {
        console.assert(httpserver !== null);
        console.assert(loggedUsers != null);

        this.loggedUsers = loggedUsers;
        this.httpserver = httpserver;
        this.log = log;
    }

    #tokenControl(req, res) {res.json({})}

    bindToTokenControll(name) {
        this.httpserver.post(name, (req, res) => this.#tokenControl(req, res))
    };

}

module.exports = AuthControlMenager;