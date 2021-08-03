
import RCTDATAPAGES from "../../../RCTDATAPAGES.js";


export default class ModelFetchedDataStructure {
    constructor() {
        for (var prop of RCTDATAPAGES) {
            this[prop] = {};
        }
    }


    consoleLogStructure(full=false) {
        if (full)
            console.log(this);
        else {
            const pObj = {};
            for (var prop in RCTDATAPAGES) {
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
        for (var prop in RCTDATAPAGES) {
            this[prop] = {};
        }
    }
}