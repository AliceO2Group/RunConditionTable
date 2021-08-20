import {h} from "/js/src/index.js";

// TODO, sidebar should be nicer'
// TODO, add using filtering, to uri construction;
import button from "../common/button.js";
import handleClick from "../../utils/handleClick.js";
import fetchedDataSection from "../common/fetchedDataSection.js";


function higherLevelButton(model, page, index, label, view) {
    var pathNQuery = `/api/Rct-Data/?page=${page}&index=${index}&view=${view}&rowsOnSite=50&site=1`;
    const fdata = model.fetchedData[page][index];
    if (fdata !== undefined && fdata !== null)
        pathNQuery = fdata.url.pathname + fdata.url.search;
    return button(model, label, (e) => handleClick(model, e), '', pathNQuery);

}

export default function sidebar(model) {
    return h('.mySidebar.flex-column.bg-gray-lighter', [
        button(model, 'Home', (e) => handleClick(model, e), '', '/home/?page=home'),
        h('.m1'),

        fetchedDataSection(model, null, 'Periods'),
        higherLevelButton(model, 'main', '_0', 'main view', 'periods'),
        fetchedDataSection(model, 'runsPerPeriod', 'Runs per period'),
        higherLevelButton(model, 'mc', '_0', 'MC', 'mc'),

        button(model, 'Pass QA Statistics Summary', () => {
            return undefined;
        }),
        button(model, 'QA Expert Flagging', () => {
            return undefined;
        }),
    ]);
}