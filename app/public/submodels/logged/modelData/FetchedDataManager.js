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

    async reqForData() {
        const params = this.router.params;
        let section = params.section
        let index = params.index
        
        const url = this.router.getUrl();``

        this.assertConditionsForReqForData(url, params)

        if (! this[section][index]) 
            this[section][index] = RemoteData.Loading();
        this.model.notify();

        let reqEndpoint = this.getReqEndpoint(url);
        let {result, status, ok} = await this.model.loader.get(reqEndpoint);
        console.log("result", result, "ok", ok);

        if (!ok)
            this[section][index] = RemoteData.failure(status);
        else
            this[section][index] = RemoteData.Success(new FetchedData(url, result));
        this.model.notify();
    }

    getReqEndpoint(url) {
        return url.pathname + url.search + '&count-records=true';
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