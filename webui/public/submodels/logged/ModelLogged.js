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
        this.parent.mode = "mUnlogged";
        sessionStorage.logged = "false";
        sessionStorage.username = null;
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
        });

        const content = await response.json()
        if (content.type === 'err') {
            console.log(content.data);
            alert('err', content.data);
        } else {
            this.RCTCurentContent = content.data.map(item => {
                item.marked = false;
                return item;
            });
            this.RCTdataFetched = true;
        }
        this.notify();
    }
}
