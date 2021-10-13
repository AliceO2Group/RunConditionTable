import {fetchClient, Observable, QueryRouter, Loader} from '/js/src/index.js';
import FetchedData from "./modelData/FetchedData.js";
import ModelFetchedDataStructure from "./modelData/ModelFetchedDataStructure.js";
const rctDataServerPathname = '/api/Rct-Data/';

export default class ModelLogged extends Observable {
    constructor(parent) {
        super();
        this.parent = parent;

        this.fetchedData = new ModelFetchedDataStructure();
        this.router = new QueryRouter();
        this.router.observe(this.handleLocationChange.bind(this));
        this.router.bubbleTo(this)

        this.loader = new Loader()

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

        this.assertConditionsForReqForData(url, params)

        if (! this.fetchedData[params.section][params.index]) {
            this.fetchedData[params.section][params.index] = new FetchedData(this, url);
        }
        if (! this.fetchedData[params.section][params.index].fetched)
            await this.fetchedData[params.section][params.index].fetch();

        return this.fetchedData[params.section][params.index];
    }

    async logout() {
        const endpoint = '/api/logout'
        const {result, status, ok} = this.loader.post(endpoint)
        this.parent._tokenExpirationHandler(status);

        localStorage.token = null;
        this.parent.mode = "mUnlogged";

        if (!ok) {
            alert("Some error occurred: " + JSON.stringify(result));
        } else {
            alert('successfully logged out');
        }

        this.router.go('/');
        this.notify();
    }




    assertConditionsForReqForData(url, params) {
        console.assert(url.pathname === rctDataServerPathname)
        console.assert(params.hasOwnProperty('section') && params.hasOwnProperty('index'));
        console.assert(params.hasOwnProperty('view'));
        console.assert(params.hasOwnProperty('rowsOnPage'));
        console.assert(params.hasOwnProperty('page'));

        console.assert(this.fetchedData.hasOwnProperty(params.section));
    }


}

