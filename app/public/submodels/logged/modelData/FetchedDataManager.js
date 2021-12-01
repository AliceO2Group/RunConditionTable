
import RCTDATA_SECTIONS from "../../../RCTDATA_SECTIONS.js";
import FetchedData from "./FetchedData.js";
const rctDataServerPathname = '/api/Rct-Data/';

/**
 * Object of this class provide that many FetchedData objects are organized,
 * each is available as ModelFetchedDataStructure_Object[sectionName][index]
 * where index is unique identifier of particular data set in chosen section
 */
export default class FetchedDataManager {
    constructor(router, model) {
        this.model = model
        this.router = router;
        for (let sectionName of RCTDATA_SECTIONS) {
            this[sectionName] = {};
        }
    }

    async reqForData() {
        const params = this.router.params;
        const url = this.router.getUrl();``

        this.assertConditionsForReqForData(url, params)

        if (! this[params.section][params.index]) {
            this[params.section][params.index] = new FetchedData(this.model, url);
        }
        if (! this[params.section][params.index].fetched)
            await this[params.section][params.index].fetch();

        return this[params.section][params.index];
    }



    assertConditionsForReqForData(url, params) {
        console.assert(url.pathname === rctDataServerPathname)
        console.assert(params.hasOwnProperty('section') && params.hasOwnProperty('index'));
        console.assert(params.hasOwnProperty('view'));
        console.assert(params.hasOwnProperty('rowsOnPage'));
        console.assert(params.hasOwnProperty('page'));

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