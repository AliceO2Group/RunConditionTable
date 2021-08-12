import {h} from "/js/src/index.js";

// TODO, sidebar should be nicer'
// TODO, add using filtering, to uri construction;
import button from "../common/button.js";
import handleClick from "../common/handleClick.js";
import fetchedDataSection from "../common/fetchedDataSection.js";

export default function sidebar(model) {
    return h('.mySidebar.flex-column.bg-gray-lighter', [
        button(model, 'Home', (e) => handleClick(model, e), '', '/home/?page=home'),
        h('.m1'),

        fetchedDataSection(model, null, 'Periods'),
        button(model, 'main', (e) => handleClick(model, e), '', '/api/Rct-Data/?page=main&index=_0&view=periods&rowsOnSite=50&site=1'),
        fetchedDataSection(model, 'runsPerPeriod', 'Runs per period'),
        button(model, 'MC', (e) => handleClick(model, e), '', '/api/Rct-Data/?page=mc&index=_0&view=mc&rowsOnSite=50&site=1'),
        button(model, 'Pass QA Statistics Summary', () => {
            return undefined;
        }),
        button(model, 'QA Expert Flagging', () => {
            return undefined;
        }),
    ]);
}