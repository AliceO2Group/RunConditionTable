import { h, switchCase } from '/js/src/index.js';
import { serialIf } from '../../utils/utils.js';
import header from '../common/header.js';
import button from '../common/button.js';
import home from "./home.js";
import rctDataView from "./rctData/rctDataView.js";
import sidebar from "./sidebar.js";



export default function userPanel(model) {
    const url = model.router.getUrl();
    return h('.flex-column.absolute-fill', [
        header(model),
        // content below menu bar
        h('.flex-grow.flex-row', [
            // sidebar
            sidebar(model),
            
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
