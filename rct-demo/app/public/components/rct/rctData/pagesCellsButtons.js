import RCTDATA_SECTIONS from "../../../RCTDATA_SECTIONS.js";
import viewButton from '../../common/viewButton.js';
import handleClick from "../../../utils/handleClick.js";

//** modify in order to create appropriate behaviour*/
const pagesCellsButtons = {
    main: {
        period: (model, item, name) => {
            return viewButton(model, item.period, (e) =>
                handleClick(model, e), '',
                `/api/Rct-Data/?section=runsPerPeriod&index=${item.period}&view=runs&period=${item.period}&rowsOnPage=50&page=1`);
        },
    },
    runsPerPeriod: {
        id: (model, item, name) => {
            return viewButton(model, item.id, (e) => handleClick(model, e), '',
                `/api/Rct-Data/?page=flags&index=${item.id}&view=flags&run_id=${item.id}&rowsOnSite=50&site=1`);
        }
    },
    flags: {},
    mc: {},
    // ...,

}

for (var p in pagesCellsButtons) {
    if (pagesCellsButtons.hasOwnProperty(p)) {
        if (! RCTDATA_SECTIONS.includes(p))
            throw Error('incorrect configuration');
    }
}

export default pagesCellsButtons;