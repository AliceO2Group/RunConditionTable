import {Observable, fetchClient, WebSocketClient, sessionService, Loader} from '/js/src/index.js';

export default class ModelUnlogged extends Observable {
    constructor(parent) {
        super();
        this.parent = parent;
        this.logginEndpoint = '/api/login/';
        this.loader = new Loader();
    }

    async login(username, password, dbname) {

        const {result, status, ok} = await this.postLoginPasses(username, password, dbname)
        this.parent._tokenExpirationHandler(status);
        if (ok)
            this.keepSessionInBrowser()
    }


    postLoginPasses(username, password, dbname) {
        return this.loader.post(
            this.logginEndpoint,
            {username: username, password: password, dbname: dbname}
        )
    }
    keepSessionInBrowser() {
        localStorage.token =  sessionService.session.token;
        this.parent.mode = "mLogged";
        this.notify();
    }

}
