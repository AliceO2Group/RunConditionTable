import RCTDATAPAGES from "../../../RCTDATAPAGES.js";
import button from '../../common/button.js';
import handleClick from "../../common/handleClick.js";

//** modify in order to create appropriate behaviour*/
const pagesCellsButtons = {
    main: {
        period: (model, item, name) => {
            return button(model, item.period, (e) =>
                handleClick(model, e), '',
                `/api/Rct-Data/?page=runsPerPeriod&index=${item.period}&view=runs&period=${item.period}&rowsOnSite=50&site=1`);
        },
    },
    runsPerPeriod: {},
    mc: {},
    // ...,

}

for (var p in pagesCellsButtons) {
    if (pagesCellsButtons.hasOwnProperty(p)) {
        if (! RCTDATAPAGES.includes(p))
            throw Error('incorrect configuration');
    }
}

export default pagesCellsButtons;