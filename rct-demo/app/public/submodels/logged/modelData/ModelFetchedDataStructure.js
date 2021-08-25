
import RCTDATA_SECTIONS from "../../../RCTDATA_SECTIONS.js";


export default class ModelFetchedDataStructure {
    constructor() {
        for (var prop of RCTDATA_SECTIONS) {
            this[prop] = {};
        }
    }


    consoleLogStructure(full=false) {
        if (full)
            console.log(this);
        else {
            const pObj = {};
            for (var prop in RCTDATA_SECTIONS) {
                pObj[prop] = [];
                for (var p in this[prop]) {
                    if (this[prop].hasOwnProperty(p))
                        pObj[prop].push(p);
                }
            }
            console.log(pObj);
        }
    }

    clear() {
        for (var prop in RCTDATA_SECTIONS) {
            this[prop] = {};
        }
    }

    delete(page, index) {
        this[page][index] = undefined;
    }
}