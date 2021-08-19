
import {fetchClient} from '/js/src/index.js';
import {replaceUrlParams} from "../../../utils/utils.js";

const defaultRowsOnSite = 100;
const defaultSite = 1;

export default class FetchedData {
    constructor(model, url, name='table') {
        this.name = name;
        this.model = model;
        this.url = url;
        this.fields = null;
        this.rows = null;
        this.fetched = false;

        const params = Object.fromEntries(url.searchParams.entries());
        this.rowsOnSite = params.hasOwnProperty('rowsOnSite') ? params.rowsOnSite : defaultRowsOnSite;
        this.site = params.hasOwnProperty('site') ? params.site : defaultSite;

        this.totalRecordsNumber = null;

        this.hideMarkedRecords = false;
    }


    async fetch() {
        this.fetched = false;
        // for loading icon displaying;
        this.model.notify();
        const reqEndpoint = this.url.pathname + this.url.search + (this.totalRecordsNumber === null || this.totalRecordsNumber === undefined ? '&count-records=true' : '');
        const response = await fetchClient(reqEndpoint, {
            method: 'GET',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
        });

        const content = await response.json()
        const status = response.status;
        this.model.parent._tokenExpirationHandler(status);

        if (content.type === 'err') {
            console.error(content.data);
            alert('err', content.data);
        } else {

            this.fields = content.data.fields.map(item => {
                item.marked = true;
                return item;
            });
            this.rows = content.data.rows.map(item => {
                item.marked = false;
                return item;
            });
            this.fetched = true;
            if (this.totalRecordsNumber === null || this.totalRecordsNumber === undefined) {
                this.totalRecordsNumber = content.data.totalRecordsNumber;
            }
        }
        this.model.notify();
    }

    changeFiltering(/**???*/) {
        // TODO
        this.fetch().then(r => {}).catch(e => {console.error(e)});
    }

    changeSite(site) {
        console.assert(site < this.totalRecordsNumber / this.rowsOnSite + 1);
        this.fetched = false;
        this.url = replaceUrlParams(this.url, [['site', site]]);
        this.model.router.go(this.url);
    }


    changeItemStatus(item) {
        item.marked = !item.marked;
        this.model.notify();
    }

    changeRecordsVisibility(data) {
        data.hideMarkedRecords = !data.hideMarkedRecords;
        this.model.notify();
    }

    clear() {
        this.fields = null;
        this.rows = null;
        this.fetched = false;
        this.hideMarkedRecords = false;
    }

    // delete() {
    //     const params = this.url.searchParams.entries();
    //     this.p
    //
    // }
}
