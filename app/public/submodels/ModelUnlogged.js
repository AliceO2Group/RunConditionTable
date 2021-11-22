import {Observable, fetchClient, WebSocketClient, sessionService} from '/js/src/index.js';


export default class ModelUnlogged extends Observable {
    constructor(parent) {
        super();
        this.parent = parent
    }

    async login(username, password, dbname) {
        console.log(username, password, dbname);
        if (username !== "" && password !== "") {
            const response = await fetchClient('/api/login', {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                body: JSON.stringify({username: username, password: password, dbname: dbname})
            });
            const content = await response.json();
            const status = response.status;
            console.log(content);
            this.parent._tokenExpirationHandler(status);

            if (content.type === 'err') {
                if (content.data === '28P01') alert('authentication failed');
                else {
                    alert("error: " + content.data);
                }
            } else {
                if (content.type === 'res') {
                    localStorage.token =  sessionService.session.token;

                    this.parent.mode = "mLogged";
                    this.notify();
                }
            }
        } else {
            alert("Incorrect information");
        }

    }

}
