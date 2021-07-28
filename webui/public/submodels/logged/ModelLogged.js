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

        this.fetchedData = {
            mainRCTTable: {
                //url: null,
                columnsNames: null, // TODO may be help in managing hiding columns, it would be list of objects holding necessary information
                rows: null,
                dataSubsetMetadata: {
                    fetched: false,
                    rowsOnSite: null,
                    site: null,
                }
            },
            periods: {
                /** structure:: */
                // periodName : {
                //              columnsNames: <...>,
                //              rows: <...>,
                //              dataSubsetMetadata: <{as above}>
                //  }
                // ...
            },
            runs: {
                // as above
            }



        };
        this.currentDataView = null;

        // TODO;
        this.username = null;
    }

    changeItemStatus(item) {
        item.marked = !item.marked;
        this.notify();
    }

    changeRecordsVisibility() {
        this.hideMarkedRecords = !this.hideMarkedRecords;
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
                console.log(this.fetchedData);
            })
        }
    }

    async reqServerForRCTHomepage(){
        const response = await fetchClient('/api/RCTHomepage', {
            method: 'GET',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
        });
        const content = await response.json()
        const status = response.status;
        this.parent._tokenExpirationHandler(status);

        if (content.type === 'err') {
            console.log(content.data);
            alert('err', content.data);
        } else {
            this.fetchedData = content.data.map(item => {
                item.marked = false;
                return item;
            });
            this.RCTdataFetched = true;
        }
        this.notify();
    }

    async logout() {
        const response = await fetchClient('/api/logout', {
            method: 'POST',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
        });
        const content = await response.json();
        const status = response.status;
        this.parent._tokenExpirationHandler(status);

        if (content.type === 'err') {
            alert("Some error occurred: " + content.data);
        } else {
            if (content.type === 'res') {
                alert('successfully logged out');
            }
        }
        sessionStorage.token = null;
        this.parent.mode = "mUnlogged";

        this.notify();
    }

}
