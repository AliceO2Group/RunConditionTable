import { h, switchCase } from '/js/src/index.js';
import { serialIf } from '../../utils/utils.js';
import header from '../common/header.js';
import button from '../common/button.js';
import home from "./home.js";
import rctDataView from "./rctData/rctDataView.js";

function handleClick(model, e) {
    model.router.handleLinkEvent(e);
    model.notify();
}

const loadedDataButtons = (model, page) => {
    const buttons = [];
    for (var index in page) {
        if (page.hasOwnProperty(index)) {
            const url = page[index].url;
            buttons.push(button(index, (e) => handleClick(model, e), '', url.pathname + url.search));
        }
    }
    return buttons;
}

const menu = (model) => h('.mySidebar.flex-column.bg-gray-lighter', [
    button('Home', (e) => handleClick(model, e), '', '/home/?page=home'),
    h('h.title', 'RCT Data'),
    button('main', (e) => handleClick(model, e), '', '/api/Rct-Data/?page=main&index=_0&view=periods&rowsOnSite=50&site=1'),
    h('h.title', 'Runs per period'),
    h('.flex-column', loadedDataButtons(model, model.fetchedData['runsPerPeriod'])),
    button('MC', (e) => handleClick(model, e), '', '/api/Rct-Data/?page=mc&index=_0&view=mc&rowsOnSite=50&site=1'),
    button('Pass QA Statistics Summary', () => {return undefined;}),
    button('QA Expert Flagging', () => {return undefined;}),
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
                    // switchCase(url.pathname, {
                    //     '/home/': home(model),
                    //     '/api/Rct-Data/': currentTableView(model),
                    // }, home(model))
                ])
            ])
        ])
    ])
}
