
import {fetchClient} from '/js/src/index.js';
import {replaceUrlParams} from "../../../utils/utils.js";

const defaultRowsOnPage = 100;
const defaultPage = 1;


/**
 * Object of this class is used to hold data fetched from backend
 * set of data held in this structure are fully defined by the url given as on of constructor arguments
 * when some filtering parameters are or page, etc. is changed
 * the url is also changed in order to be consistent with data
 *
 */

export default class FetchedData {
    constructor(model, url, name='table') {
        this.name = name;
        this.model = model;
        this.url = url;
        this.fields = null;
        this.rows = null;
        this.fetched = false;

        const params = Object.fromEntries(url.searchParams.entries());
        this.rowsOnPage = params.hasOwnProperty('rowsOnPage') ? params.rowsOnPage : defaultRowsOnPage;
        this.site = params.hasOwnProperty('page') ? params.page : defaultPage;

        this.totalRecordsNumber = null;

        this.hideMarkedRecords = false;
    }

    /**
     * function request server for data set defined by url field,
     * when first after creating object request is performed,
     * to url is added additional param 'count-records',
     * which inform backend to calculate the total number of rows in target view
     * this information is used to create site navigation
     * @returns {Promise<void>}
     */
    async fetch() {
        this.fetched = false;
        // for loading icon (spinner) displaying;
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

    changePage(page) {
        console.assert(page < this.totalRecordsNumber / this.rowsOnPage + 1);
        this.fetched = false;
        this.url = replaceUrlParams(this.url, [['page', page]]);
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
