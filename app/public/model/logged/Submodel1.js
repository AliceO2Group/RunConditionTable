import {Observable, Loader} from '/js/src/index.js';
import FetchedDataManager from "./modelData/FetchedDataManager.js";
import applicationProperties from "../../applicationProperties.js";
const dataReqParams = applicationProperties.dataReqParams;
const pagesNames = applicationProperties.pagesNames;


export default class Submodel1 extends Observable {
    constructor(parent) {
        super();
        this.parent = parent;
        this.router = parent.router;
        this.routerCallback = this.handleLocationChange.bind(this);
        this.router.observe(this.routerCallback);
        this.router.bubbleTo(this)

        this.fetchedData = new FetchedDataManager(this.router, this);
        
        this.searchFieldsVisible = false;

        this.loader = new Loader()


        this.handleLocationChange(); // Init first page
    }

    changeSearchFieldsVisibility() {
        this.searchFieldsVisible = !this.searchFieldsVisible;
    }

    handleLocationChange() {
        const url = this.router.getUrl();
        switch (url.pathname) {
            default:
                if (url.pathname === "/") {
                    this.router.go(`/periods/?&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`)
                } else {
                    this.fetchedData.reqForData()
                        .then(r => {})
                        .catch(e => {console.error(e)});
                }
                break;
        }
    }


    async logout() {
        const logoutEndpoint = '/api/logout/'
        const {result, status, ok} = this.loader.post(logoutEndpoint)
        this.parent._tokenExpirationHandler(status);

        localStorage.token = null;
        this.parent.mode = "default";

        if (!ok) {
            alert("Some error occurred: " + JSON.stringify(result));
        } else {
            alert('successfully logged out');
        }

        this.router.go('/');
        this.notify();
    }
}