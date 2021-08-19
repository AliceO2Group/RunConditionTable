import {h, switchCase} from '/js/src/index.js';
import button from '../../common/button.js';
import tableHeader from './table/header.js';
import row from './table/row.js';
import pagesCellsButtons from "./pagesCellsButtons.js";
import {range, replaceUrlParams} from "../../../utils/utils.js";


export default function tableView(model) {

    const params = model.router.params;
    const data = model.fetchedData[params.page][params.index];

    const cellsButtons = pagesCellsButtons[params.page];

    const fields = data.fields;
    const visibleFields = fields.filter(f => f.marked);

    return h('div.p3', [
        fieldsVisibilityControl(model, data, fields),
        siteController(model, data),
        button(model, 'reload data', () => data.fetch(), 'reload-btn'), ' ', // TODO move up
        h('table.table', {id: 'data-table-' + data.url}, [

            // h('caption', data.name),
            tableHeader(visibleFields, data, () => data.changeRecordsVisibility(data)),
            tableBody(model, visibleFields, data, cellsButtons)

        ])
    ])

}

const visibleNeighbourButtonsRange = 2;
const maxVisibleButtons = 10;

function siteController(model, data) {
    const mapArrayToButtons = (arr) => arr.map(i => {
        const site = i + 1;
        const url = replaceUrlParams(data.url, [['site', site]]);
        return button(model, site, () => data.changeSite(site), '', url.pathname + url.search, '', '.m1', true);
    })
    const sitesNumber = Math.ceil(data.totalRecordsNumber / data.rowsOnSite);
    const currentSite = Number(Object.fromEntries(data.url.searchParams.entries())['site']);
    const currentSiteIdx = currentSite - 1;

    const middleButtonsR = range(Math.max(0, currentSiteIdx - visibleNeighbourButtonsRange),
                                 Math.min(sitesNumber, currentSiteIdx + visibleNeighbourButtonsRange + 1));

    const leftButtonsR = range(0,
                               Math.min(middleButtonsR[0], Math.floor((maxVisibleButtons - (2 * visibleNeighbourButtonsRange + 1)) / 2)));

    const rightButtonsR = range(Math.max(middleButtonsR[middleButtonsR.length - 1] + 1, sitesNumber - Math.floor((maxVisibleButtons - (2 * visibleNeighbourButtonsRange + 1)) / 2)),
                                sitesNumber);

    const leftThreeDotsPresent = !(leftButtonsR[leftButtonsR.length - 1] === middleButtonsR[0] - 1 || leftButtonsR.length === 0);
    const rightThreeDotsPresent = !(rightButtonsR[0] === middleButtonsR[middleButtonsR.length - 1] + 1 || rightButtonsR.length === 0);

    // TODO add tooltips
    const siteChangingController = (onclickF, label, toggleTitle='') => h('a.site-changing-controller', {onclick: onclickF}, label);

    return h('.flex-row', [
        'site:',
        currentSite > 1 ? siteChangingController(() => data.changeSite(1), '<<') : '',
        currentSite > 3 ? siteChangingController(() => data.changeSite(Math.floor(currentSite / 2)), '|') : '',
        currentSite > 1 ? siteChangingController(() => data.changeSite(currentSite - 1), '<'): '',
        mapArrayToButtons(leftButtonsR),
        leftThreeDotsPresent ? '...' : '',
        mapArrayToButtons(middleButtonsR),
        rightThreeDotsPresent ? '...' : '',
        mapArrayToButtons(rightButtonsR),
        currentSite < sitesNumber ? siteChangingController(() => data.changeSite(currentSite + 1), '>') : '',
        currentSite < sitesNumber - 2 ? siteChangingController(() => data.changeSite(currentSite + Math.floor((sitesNumber - currentSite) / 2)), '|') : '',
        currentSite < sitesNumber ? siteChangingController(() => data.changeSite(sitesNumber), '>>'): '',
    ]);

}


function fieldsVisibilityControl(mode, data, fields) {
    return h('.flex-row.p3.justify-start', fields.map(f =>
        h('span.p1.thin-border', [
            h('.d-block.w-100', h('input.p3', {
                onclick: () => data.changeItemStatus(f),
                checked: f.marked,
                type: 'checkbox'
            })),
            h('p', f.name)
        ])
    ))
}


function tableBody(model, visibleFields, data, cellsButtons) {
    return h('tbody', {id: 'table-body-' + data.url},
        data.rows.map(item => row(model, visibleFields, data, item, cellsButtons))
    );
}