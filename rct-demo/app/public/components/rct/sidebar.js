import {h} from "/js/src/index.js";

// TODO, sidebar should be nicer'
// TODO, add using filtering, to uri construction;
import viewButton from "../common/viewButton.js";
import handleClick from "../../utils/handleClick.js";
import fetchedDataSection from "./fetchedDataSection.js";


function higherLevelButton(model, section, index, label, view) {
    let pathNQuery = `/api/Rct-Data/?section=${section}&index=${index}&view=${view}&rowsOnPage=50&page=1`;
    const fdata = model.fetchedData[section][index];
    if (fdata !== undefined && fdata !== null)
        pathNQuery = fdata.url.pathname + fdata.url.search;
    return viewButton(model, label, (e) => handleClick(model, e), '', pathNQuery);

}

export default function sidebar(model) {
    return h('.mySidebar.flex-column.bg-gray-lighter', [
        viewButton(model, 'Home', (e) => handleClick(model, e), '', '/home/?section=home'),
        h('.m1'),

        fetchedDataSection(model, null, 'Periods'),
        higherLevelButton(model, 'main', '_0', 'main view', 'periods'),
        fetchedDataSection(model, 'runsPerPeriod', 'Runs per period'),
        fetchedDataSection(model, null, 'Monte Carlo'),
        higherLevelButton(model, 'mc', '_0', 'main view', 'mc'),

        // button(model, 'Pass QA Statistics Summary', () => {
        //     return undefined;
        // }),
        fetchedDataSection(model, 'flags', 'QA Expert Flagging'),
    ]);
}