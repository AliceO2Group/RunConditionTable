
import RCTDATA_SECTIONS from "../../../RCTDATA_SECTIONS.js";

/**
 * Object of this class provide that many FetchedData objects are organized,
 * each is available as ModelFetchedDataStructure_Object[sectionName][index]
 * where index is unique identifier of particular data set in chosen section
 */
export default class FetchedDataManager {
    constructor() {
        for (let sectionName of RCTDATA_SECTIONS) {
            this[sectionName] = {};
        }
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