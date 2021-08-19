import {fetchClient, Observable, QueryRouter} from '/js/src/index.js';
import FetchedData from "./modelData/FetchedData.js";
import ModelFetchedDataStructure from "./modelData/ModelFetchedDataStructure.js";
const rctDataServerPathname = '/api/Rct-Data/';

export default class ModelLogged extends Observable {
    constructor(parent) {
        super();
        this.parent = parent;

        this.fetchedData = new ModelFetchedDataStructure();

        // TODO;
        this.username = null;

        // Setup router
        this.router = new QueryRouter();
        this.router.observe(this.handleLocationChange.bind(this));
        this.handleLocationChange(); // Init first page
    }

    handleLocationChange() {
        const params = this.router.params;
        const url = this.router.getUrl();
        switch (url.pathname) {
            case '/api/Rct-Data/':
                this.reqForData()
                    .then(r => {})
                    .catch(e => {console.error(e)});
            break;
            case '/home/':
                break;
            default:
                // default route, replace the current one not handled
                // this.router.go('/home', false);
                break;
        }
    }


    async reqForData() {
        const params = this.router.params;
        const url = this.router.getUrl();

        console.assert(url.pathname === rctDataServerPathname)
        console.assert(params.hasOwnProperty('page') && params.hasOwnProperty('index'));
        console.assert(params.hasOwnProperty('view'));
        console.assert(params.hasOwnProperty('rowsOnSite'));
        console.assert(params.hasOwnProperty('site'));

        console.assert(this.fetchedData.hasOwnProperty(params.page));


        if (! this.fetchedData[params.page][params.index]) {
            this.fetchedData[params.page][params.index] = new FetchedData(this, url);
        }
        if (! this.fetchedData[params.page][params.index].fetched)
            await this.fetchedData[params.page][params.index].fetch();

        return this.fetchedData[params.page][params.index];
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
        this.router.go('/');

        this.notify();
    }

}
