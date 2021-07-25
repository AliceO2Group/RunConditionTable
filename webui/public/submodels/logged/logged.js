import {Observable, fetchClient, WebSocketClient} from '/js/src/index.js';


export default class ModelLogged extends Observable {
    constructor(parent) {
        super();

        this.parent = parent;

        this.hideMarkedRecords = false;
        this.contentVisibility = {
            RCTHomepageVisible: false
        }
        this.currentContent = null;

        this.RCTCurentContent = null;
        this.RCTdataFetched = false;

        // TODO;
        this.username = null;
        this.password = null;
        this.dbname = null;
    }

    changeItemStatus(item) {
        item.marked = !item.marked;
        this.notify();
    }

    changeRecordsVisibility() {
        this.hideMarkedRecords = !this.hideMarkedRecords;
        this.notify();
    }

    async logout() {
        const response = await fetchClient('/api/logout', {
            method: 'POST',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            // body: JSON.stringify({username: window.sesService.session.username, id: window.sesService.session.personid})
        });
        const content = await response.json();
        console.log(content)
        if (content.type === 'err') {
            alert("Some error occurred: " + content.data);
        } else {
            if (content.type === 'res') {
                alert('successfully logged out');
                window.sesService.session.name = 'Anonymous';
                window.sesService.session.username = 'Anonymous';
                window.sesService.session.personid = 0;
            }
        }
        this.parent.mode = "unlogged";
        sessionStorage.logged = "false";
        sessionStorage.username = null;
        sessionStorage.password = null;
        sessionStorage.dbname = null;

        this.notify();
    }

    showHideRCTHomepage() {
        if (this.contentVisibility.RCTHomepageVisible) {
            this.contentVisibility.RCTHomepageVisible = false;
            this.currentContent = null;
        } else {
            if (this.currentContent !== null)
                this.contentVisibility[this.currentContent] = false;
            this.contentVisibility.RCTHomepageVisible = true;
            this.currentContent = "RCTHomepageVisible";
        }
        this.notify();
        if (!this.RCTdataFetched) {
            this.reqServerForRCTHomepage().then(r => {
                console.log(this.RCTCurentContent);
            })
        }
    }

    async reqServerForRCTHomepage(){
        const response = await fetchClient('/api/RCTHomepage', {
            method: 'POST',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({username: this.username, password: this.password, dbname: this.dbname})
        });

        const content = await response.json()
        this.RCTCurentContent = content.data.map(item => {item.marked = false; return item;});
        this.RCTdataFetched = true;
        console.log(this.RCTCurentContent);
        this.notify();
    }
}
