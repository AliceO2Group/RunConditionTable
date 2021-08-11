import { h, switchCase } from '/js/src/index.js';
import { serialIf } from '../../utils/utils.js';
import header from '../common/header.js';
import button from '../common/button.js';
import home from "./home.js";
import rctDataView from "./rctData/rctDataView.js";
import fetchedDataSection from "../common/fetchedDataSection.js";
import handleClick from "../common/handleClick.js";



// TODO, sidebar should be nicer'
// TODO, add using filtering, to uri construction;
const menu = (model) => h('.mySidebar.flex-column.bg-gray-lighter', [
    button(model, 'Home', (e) => handleClick(model, e), '', '/home/?page=home'),
    h('.m1'),

    fetchedDataSection(model, null, 'Periods'),
    button(model, 'main', (e) => handleClick(model, e), '', '/api/Rct-Data/?page=main&index=_0&view=periods&rowsOnSite=50&site=1'),
    fetchedDataSection(model, 'runsPerPeriod', 'Runs per period'),
    button(model, 'MC', (e) => handleClick(model, e), '', '/api/Rct-Data/?page=mc&index=_0&view=mc&rowsOnSite=50&site=1'),
    button(model, 'Pass QA Statistics Summary', () => {return undefined;}),
    button(model, 'QA Expert Flagging', () => {return undefined;}),
]);

export default function userPanel(model) {
    const url = model.router.getUrl();
    console.log('userPanel', url);
    return h('.flex-column.absolute-fill', [
        header(model),
        // content below menu bar
        h('.flex-grow.flex-row', [
            // sidebar
            menu(model),
            
            // content
            h('.flex-grow.relative', [
                h('.scroll-y.absolute-fill.bg-white', {id: 'main-content'}, [
                    // TODO handling more cases;
                    url.pathname === '/api/Rct-Data/' ? rctDataView(model) : home(model),
                    // TODO why this one below doesn't work;
                    // switchCase(url.pathname, {
                    //     '/home/': home(model),
                    //     '/api/Rct-Data/': currentTableView(model),
                    // }, home(model))
                ])
            ])
        ])
    ])
}
