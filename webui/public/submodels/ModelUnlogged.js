import {Observable, fetchClient, WebSocketClient} from '/js/src/index.js';


export default class ModelUnlogged extends Observable {
    constructor(parent) {
        super();
        this.parent = parent
    }

    async login(username, password, dbname) {
        if (username !== "" && password !== "") {
            const response = await fetchClient('/api/login', {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                body: JSON.stringify({username: username, password: password, dbname: dbname})
            });
            const content = await response.json();
            console.log(content)
            if (content.type === 'err') {
                if (content.data === '28P01') alert('authentication failed');
                else {
                    alert("error: " + content.data);
                }
            } else {
                if (content.type === 'res') {
                    // TODO tę redundancję
                    window.sesService.session.username = username;
                    window.sesService.session.name = username;
                    window.sesService.session.personid = content.id;
                    console.log(this.parent)
                    this.parent.mLogged.username = username;
                    this.parent.mLogged.password = password;
                    this.parent.mLogged.dbname = dbname;
                    // sessionStorage.logged = "true";
                    // sessionStorage.username = username;
                    // sessionStorage.token =  sesService.session.token;
                    // sessionStorage.dbname = dbname;
                    // sessionStorage.password = password;

                    this.parent.mode = "mLogged";
                    this.notify();
                }
            }
        } else {
            alert("Incorrect information");
        }

    }

}
