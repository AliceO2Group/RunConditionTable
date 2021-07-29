
import {fetchClient} from '/js/src/index.js';


export default class FetchedData {
    constructor(model, url) {
        this.model = model;
        this.url = url;
        this.columnsNames = null; // TODO may be help in managing hiding columns, it would be list of objects holding necessary information
        this.rows = null
        this.metadata = {
            fetched: false,
            rowsOnSite: null,
            site: null,
            }
    }

    async reqServerForRCTHomepage(){
        this.metadata.fetched = false;
        const response = await fetchClient('/api/RCTHomepage', {
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
            this.rows = content.data.map(item => {
                item.marked = false;
                return item;
            });
            this.metadata.fetched = true;
        }
        this.model.notify();
    }

    async fetch() {
        await this.reqServerForRCTHomepage();
    }
}
