
import {fetchClient} from '/js/src/index.js';


export default class FetchedData {
    constructor(model, url) {
        this.model = model;
        this.url = url;
        this.fields = null; // TODO may be help in managing hiding columns, it would be list of objects holding necessary information
        this.rows = null
        this.metadata = {
            fetched: false,
            rowsOnSite: null,
            site: null,
            }
    }


    async fetch(url) {
        //TODO parsing url to <query?>, rowsOnSite, site;

        this.metadata.fetched = false;
        // for loading icon displaying;
        this.model.notify();
        const response = await fetchClient(/**TODO*/url ? url : '/api/RCTHomepage', {
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
            this.metadata.fetched = true;
        }
        this.model.notify();
    }
}
