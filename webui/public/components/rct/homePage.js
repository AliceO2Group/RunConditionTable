import { h } from '/js/src/index.js';
import RCTTableView from './tableView.js';

export default function RCTHomepage(model) {
    const cssClass1 = '.flex-column.items-center.justify-center';
    const cssClass2 = 'h1.primary.justify_center';
    const cssClass3 = 'div.flex-row.items-end';
    
    return h(cssClass1,
        h(cssClass2, [
            h(cssClass3, 'RCT Homepage'),
            h('div.flex-row.items-end', []),
            RCTTableView(model)
        ])
    );
}