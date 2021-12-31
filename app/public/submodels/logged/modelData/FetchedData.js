const defaultRowsOnSite = 100;
const defaultSite = 1;


/**
 * Object of this class is used to hold data fetched from backend
 * set of data held in this structure are fully defined by the url given as on of constructor arguments
 * when some filtering parameters are or site, etc. is changed
 * the url is also changed in order to be consistent with data
 *
 */

export default class FetchedData {
    constructor(url, content, totalRecordsNumber=null) {
        this.url = url;

        this.fields = null;
        this.rows = null;

        this.totalRecordsNumber = null;
        this.hideMarkedRecords = false;

        this.rowsOnsite = null;
        this.site = null;

        this.parseFetchedFields(content)
        this.parseFetchedRows(content)
        if (!totalRecordsNumber)
            this.setInfoAboutTotalRecordsNumber(content)
        else
            this.totalRecordsNumber = totalRecordsNumber;

        this.setSiteAndRowsOnSite()

    }

    setSiteAndRowsOnSite() {
        const params = Object.fromEntries(this.url.searchParams.entries());
        this.rowsOnsite = params.hasOwnProperty('rowsOnsite') ? params.rowsOnsite : defaultRowsOnSite;
        this.site = params.hasOwnProperty('site') ? params.site : defaultSite;
    }


    getReqEndpoint(url) {
        return url.pathname + url.search +
            ((this.totalRecordsNumber) ? '&count-records=true' : '');
    }
    parseFetchedFields(content) {
        this.fields = content.data.fields.map(item => {
            item.marked = true;
            return item;
        });
    }
    parseFetchedRows(content) {
        this.rows = content.data.rows.map(item => {
            item.marked = false;
            return item;
        });
    }
    setInfoAboutTotalRecordsNumber(content) {
        if (this.totalRecordsNumber === null || this.totalRecordsNumber === undefined) {
            this.totalRecordsNumber = content.data.totalRecordsNumber;
        }
    }

    changeFiltering(/**???*/) {
        // TODO
        //this.fetch().then(r => {}).catch(e => {console.error(e)});
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

    handleError(content) {
        console.error(content.data);
        alert('err', content.data);
    }
}
