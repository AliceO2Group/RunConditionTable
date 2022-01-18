import {Observable, fetchClient, WebSocketClient, sessionService, Loader} from '/js/src/index.js';

export default class ____ModelUnlogged extends Observable {
    constructor(parent) {
        super();
        this.parent = parent;
        this.logginEndpoint = '/api/login/';
        this.loader = new Loader();
    }
}
