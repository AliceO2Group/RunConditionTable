import viewButton from '../../common/viewButton.js';
import handleClick from "../../../utils/handleClick.js";
import {h} from "/js/src/index.js";
import applicationProperties from "../../../applicationProperties.js";
const dataReqParams = applicationProperties.dataReqParams;
const pagesNames = applicationProperties.pagesNames;

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
                    TODO : this pattern is deprecated
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
                    `/${pagesNames.runsPerPeriod}/${item.name}/?${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`),

                viewButton(model, 'data passes', (e) =>
                        handleClick(model, e), '',
                    `/${pagesNames.dataPasses}/${item.name}/?${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`),

                viewButton(model, 'MC', (e) =>
                        handleClick(model, e), '',
                    `/${pagesNames.mc}/${item.name}/?${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`),
            ];
        },
    },
    dataPasses: {},
    mc: {},
    runsPerPeriod: {
        run_number: (model, item, name) => {
            return viewButton(model, item.run_number, (e) => handleClick(model, e), '',
                `/${pagesNames.flags}/${item.run_number}/?${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`);
        }
    },
    flags: {},
    // ...,

}


// checking correctness of configuration
for (let p in pagesCellsButtons) {
    if (pagesCellsButtons.hasOwnProperty(p)) {
        if (! pagesNames.hasOwnProperty(p))
            throw Error('incorrect configuration');
    }
}

export default pagesCellsButtons;