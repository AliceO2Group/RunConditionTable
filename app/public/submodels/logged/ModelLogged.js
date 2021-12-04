import {Observable, QueryRouter, Loader} from '/js/src/index.js';
import FetchedDataManager from "./modelData/FetchedDataManager.js";

export default class ModelLogged extends Observable {
    constructor(parent) {
        super();
        this.parent = parent;

        this.router = new QueryRouter();
        this.router.observe(this.handleLocationChange.bind(this));
        this.router.bubbleTo(this)

        this.fetchedData = new FetchedDataManager(this.router, this);

        this.loader = new Loader()

        this.handleLocationChange(); // Init first page
    }

    handleLocationChange() {
        const params = this.router.params;
        const url = this.router.getUrl();
        switch (url.pathname) {
            case '/api/Rct-Data/':
                this.fetchedData.reqForData()
                    .then(r => {})
                    .catch(e => {console.error(e)});
            break;
            case '/home/':
                break;
            default:
                // this.router.go('/home', false);
                break;
        }
    }




    async logout() {
        const logoutEndpoint = '/api/logout'
        const {result, status, ok} = this.loader.post(logoutEndpoint)
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







}

