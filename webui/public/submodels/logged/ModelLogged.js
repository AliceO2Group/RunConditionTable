import {Observable, fetchClient, QueryRouter} from '/js/src/index.js';
import FetchedData from "./FetchedData.js";


export default class ModelLogged extends Observable {
    constructor(parent) {
        super();
        this.parent = parent;

        this.contentVisibility = {
            RCTHomepageVisible: false
        }
        this.currentContent = null;

        this.fetchedData = {
            mainRCTTable: null,
            periods: {
                /** structure:: */
                // periodName : {
                //              columnsNames: <...>,
                //              rows: <...>,
                //  }
                // ...
            },
            runs: {
                // as above
            }
        };

        // TODO;
        this.username = null;

        // Setup router
        this.router = new QueryRouter();
        this.router.observe(this.handleLocationChange.bind(this));
        this.handleLocationChange(); // Init first page
    }

    handleLocationChange() {
        switch (this.router.params.page) {
            case 'periods':
                // call some ajax to load periods
                break;
            case 'item':
                // call some ajax to load item this.router.params.id
                break;
            default:
                // default route, replace the current one not handled
                this.router.go('?page=periods', true);
                break;
        }
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
        if (this.fetchedData.mainRCTTable === null) {
            this.reqServerForRCTHomepage().then(r => {
                console.log(this.fetchedData);
            })
        }
    }

    async reqServerForRCTHomepage() {
        this.fetchedData.mainRCTTable = new FetchedData(this, '/api/RCT-Data/?table=periods&rowsOnSite=50&site=1');
        await this.fetchedData.mainRCTTable.fetch();
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
