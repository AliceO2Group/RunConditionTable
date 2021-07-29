
import {fetchClient} from '/js/src/index.js';

const defaultRowsOnSite = 50;

export default class FetchedData {
    constructor(model, url, name='table') {
        this.name = name;
        this.model = model;
        this.url = url;
        this.fields = null; // TODO may be help in managing hiding columns, it would be list of objects holding necessary information
        this.rows = null;
        this.fetched = false;
        this.rowsOnSite = defaultRowsOnSite;
        this.site = 1;
        this.hideMarkedRecords = false;
    }


    async fetch() {
        //TODO parsing url to <query?>, rowsOnSite, site;
        console.log('fetching from: ', this.url);
        this.fetched = false;
        // for loading icon displaying;
        this.model.notify();
        const response = await fetchClient(/**TODO*/this.url ? this.url : '/date', {
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
}
