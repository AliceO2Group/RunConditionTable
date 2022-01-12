import RCT_DATA_PAGES from "../../../RCT_DATA_PAGES.js";
import viewButton from '../../common/viewButton.js';
import handleClick from "../../../utils/handleClick.js";
import {h} from "/js/src/index.js";


/** Configuration what buttons at which cells and which pages are supposed
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
                `/Rct-Data/?page=runsPerPeriod&index=${item.period}&period=${item.period}&rowsOnSite=50&site=1`);
        },
    },
    // ...,
}

 * means that in page main in column period cells will be buttons which will redirect
 * to page runs with fetched data from table runs related to chosen period.
 */

const pagesCellsButtons = {
    periods: {
        name: (model, item, name) => {
            return [
                h('', item.name),
                viewButton(model, `runs`, (e) =>
                handleClick(model, e), '',
                `/?page=runsPerPeriod&index=${item.name}&name=${item.name}&rowsOnSite=50&site=1`),

                viewButton(model, 'data passes', (e) =>
                        handleClick(model, e), '',
                    `/?page=dataPasses&index=${item.name}&name=${item.name}&rowsOnSite=50&site=1`),

                viewButton(model, 'MC', (e) =>
                        handleClick(model, e), '',
                    `/?page=mc&index=${item.name}&name=${item.name}&rowsOnSite=50&site=1`),
            ];
        },
    },
    dataPasses: {},
    mc: {},
    runsPerPeriod: {
        run_number: (model, item, name) => {
            return viewButton(model, item.run_number, (e) => handleClick(model, e), '',
                `/?page=flags&index=${item.run_number}&run_id=${item.run_number}&rowsOnSite=50&site=1`);
        }
    },
    flags: {},
    // ...,

}


// checking correctness of configuration
for (let p in pagesCellsButtons) {
    if (pagesCellsButtons.hasOwnProperty(p)) {
        if (! RCT_DATA_PAGES.includes(p))
            throw Error('incorrect configuration');
    }
}

export default pagesCellsButtons;