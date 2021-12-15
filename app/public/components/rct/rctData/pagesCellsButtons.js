import RCTDATA_SECTIONS from "../../../RCTDATA_SECTIONS.js";
import viewButton from '../../common/viewButton.js';
import handleClick from "../../../utils/handleClick.js";
import {h} from "/js/src/index.js";


/** Configuration what buttons at which cells and which sections are supposed
 *  to appear is done using object below which contains
 *  appropriate lambda expression generating button with defined behaviour
 *  regarding <model, item(particular row given as object), name(of column)>
 *  e.g:
 *  @example

const pagesCellsButtons = {
    periods: {
        period: (model, item, name) => {
            return viewButton(model, item.period, (e) =>
                    handleClick(model, e), '',
                `/api/Rct-Data/?section=runsPerPeriod&index=${item.period}&view=runs&period=${item.period}&rowsOnPage=50&page=1`);
        },
    },
    // ...,
}

 * means that in section main in column period cells will be buttons which will redirect
 * to section runs with fetched data from table runs related to chosen period.
 */

const pagesCellsButtons = {
    periods: {
        name: (model, item, name) => {
            return [
                h('', item.name),
                viewButton(model, `runs`, (e) =>
                handleClick(model, e), '',
                `/api/Rct-Data/?section=runsPerPeriod&index=${item.name}&view=runs&name=${item.name}&rowsOnPage=50&page=1`),

                viewButton(model, 'data passes', (e) =>
                        handleClick(model, e), '',
                    `/api/Rct-Data/?section=dataPasses&index=${item.name}&view=dataPasses&name=${item.name}&rowsOnPage=50&page=1`),

                viewButton(model, 'MC', (e) =>
                        handleClick(model, e), '',
                    `/api/Rct-Data/?section=mc&index=${item.name}&view=mc&name=${item.name}&rowsOnPage=50&page=1`),
            ];
        },
    },
    dataPasses: {},
    mc: {},
    runsPerPeriod: {
        run_number: (model, item, name) => {
            return viewButton(model, item.run_number, (e) => handleClick(model, e), '',
                `/api/Rct-Data/?section=flags&index=${item.run_number}&view=flags&run_id=${item.run_number}&rowsOnPage=50&page=1`);
        }
    },
    flags: {},
    // ...,

}


// checking correctness of configuration
for (let p in pagesCellsButtons) {
    if (pagesCellsButtons.hasOwnProperty(p)) {
        if (! RCTDATA_SECTIONS.includes(p))
            throw Error('incorrect configuration');
    }
}

export default pagesCellsButtons;