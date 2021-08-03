
import {fetchClient} from '/js/src/index.js';

const defaultRowsOnSite = 50;
const defaultSite = 1;

export default class FetchedData {
    constructor(model, url, name='table') {
        this.name = name;
        this.model = model;
        this.url = url;
        this.fields = null;
        this.rows = null;
        this.fetched = false;

        const params = url.searchParams.entries();
        this.rowsOnSite = params.hasOwnProperty('rowsOnSite') ? params.rowsOnSite : defaultRowsOnSite;
        this.site = params.hasOwnProperty('site') ? params.site : defaultSite;

        this.hideMarkedRecords = false;
    }


    async fetch() {
        console.log('fetching from: ', this.url);
        this.fetched = false;
        // for loading icon displaying;
        this.model.notify();
        const response = await fetchClient(/**TODO*/this.url ? this.url.pathname + this.url.search : '/date', {
            method: 'GET',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
        });

        const content = await response.json()
        const status = response.status;
        this.model.parent._tokenExpirationHandler(status);

        if (content.type === 'err') {
            console.log(content.data);
            alert('err', content.data);
        } else {
            // TODO may add some function like "addDisplayAttributes"
            this.fields = content.data.fields.map(item => {
                item.marked = false;
                return item;
            });
            this.rows = content.data.rows.map(item => {
                item.marked = false;
                return item;
            });
            this.fetched = true;
        }
        this.model.notify();
    }

    changeFiltering(/**???*/) {
        // TODO
        this.fetch();
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
}
