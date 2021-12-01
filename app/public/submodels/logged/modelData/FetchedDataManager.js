import {RemoteData, Loader} from '/js/src/index.js';

import RCTDATA_SECTIONS from "../../../RCTDATA_SECTIONS.js";
import FetchedData from "./FetchedData.js";

const rctDataServerPathname = '/api/Rct-Data/';
const defaultRowsOnPage = 100;
const defaultPage = 1;

/**
 * Object of this class provide that many FetchedData objects are organized,
 * each is available as ModelFetchedDataStructure_Object[sectionName][index]
 * where index is unique identifier of particular data set in chosen section
 */
export default class FetchedDataManager {
    constructor(router, model) {
        this.model = model
        this.router = router;
        this.loader = new Loader();
        
        for (let sectionName of RCTDATA_SECTIONS) {
            this[sectionName] = {};
        }
    }
    /**
     * function ask server for data set defined by url field,
     * when first after creating object request is performed,
     * to url is added additional param 'count-records',
     * which inform backend to calculate the total number of rows in target view
     * this information is used to create site navigation
     */

    async reqForData(force=false) {
        const params = this.router.params;
        let section = params.section
        let index = params.index
        const url = this.router.getUrl();

        const data = this[section][index]
        if (!data || force)
            await this.req(true);
        else if (data.payload.url !== url.pathname + url.search) {
            await this.req(false);
        }
    }

    async req(countAllRecord) {
        const params = this.router.params;
        let section = params.section
        let index = params.index

        const url = this.router.getUrl();

        this.assertConditionsForReqForData(url, params)
        let totalRecordsNumber = null;
        if (!countAllRecord)
            totalRecordsNumber = this[section][index].payload.totalRecordsNumber

        this[section][index] = RemoteData.Loading();
        this[section][index].payload = {"url": url}
        this.model.notify();

        let reqEndpoint = this.getReqEndpoint(url, countAllRecord);
        let {result, status, ok} = await this.model.loader.get(reqEndpoint);

        if (!ok)
            this[section][index] = RemoteData.failure({"status": status, "url": url});
        else
            this[section][index] = RemoteData.Success(new FetchedData(url, result, totalRecordsNumber));
        this.model.notify();
    }

    getReqEndpoint(url, countAllRecord) {
        return url.pathname + url.search + (countAllRecord ? '&count-records=true' : '');
    }

    changePage(page) {
        const params = this.router.params;
        let section = params.section
        let index = params.index

        const url = this[section][index].payload.changeKeptPage(page)
        this.router.go(url);
    }


    changeItemStatus(item) {
        item.marked = !item.marked;
        this.model.notify();
    }

    changeRecordsVisibility(data) {
        data.hideMarkedRecords = !data.hideMarkedRecords;
        this.model.notify();
    }


    assertConditionsForReqForData(url, params) {
        console.assert(url.pathname === rctDataServerPathname)
        console.assert(params.hasOwnProperty('section') && params.hasOwnProperty('index'));
        console.assert(params.hasOwnProperty('view'));
        console.assert(params.hasOwnProperty('rowsOnPage'));
        console.assert(params.hasOwnProperty('page'));

        console.log(this)
        console.assert(this.hasOwnProperty(params.section));
    }

    consoleLogStructure(full=false) {
        if (full)
            console.log(this);
        else {
            const pObj = {};
            for (let sectionName in RCTDATA_SECTIONS) {
                pObj[sectionName] = [];
                for (let p in this[sectionName]) {
                    if (this[sectionName].hasOwnProperty(p))
                        pObj[sectionName].push(p);
                }
            }
            console.log(pObj);
        }
    }

    clear() {
        for (let sectionName in RCTDATA_SECTIONS) {
            this[sectionName] = {};
        }
    }

    delete(page, index) {
        this[page][index] = undefined;
    }
}