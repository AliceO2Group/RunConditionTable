import viewButton from "../../common/viewButton.js";
import {range, replaceUrlParams} from "../../../utils/utils.js";
import {h} from '/js/src/index.js';

const visibleNeighbourButtonsRange = 2;
const maxVisibleButtons = 10; // maximal number of visible buttons

/**
 * creates a container containing buttons handling changes of pages
 * @param model
 * @param data
 * @returns {*}
 */
export default function siteController(model, data) {
    const mapArrayToButtons = (arr) => arr.map(i => {
        const page = i + 1;
        const url = replaceUrlParams(data.url, [['page', page]]);
        return viewButton(model, page, () => data.changePage(page), '', url.pathname + url.search, '', '.m1', true);
    })
    const pagesNumber = Math.ceil(data.totalRecordsNumber / data.rowsOnPage);
    const currentPage = Number(Object.fromEntries(data.url.searchParams.entries())['page']);
    const currentPageIdx = currentPage - 1;

    const middleButtonsR = range(Math.max(0, currentPageIdx - visibleNeighbourButtonsRange),
        Math.min(pagesNumber, currentPageIdx + visibleNeighbourButtonsRange + 1));

    const leftButtonsR = range(0,
        Math.min(middleButtonsR[0], Math.floor((maxVisibleButtons - (2 * visibleNeighbourButtonsRange + 1)) / 2)));

    const rightButtonsR = range(Math.max(middleButtonsR[middleButtonsR.length - 1] + 1,
            pagesNumber - Math.floor((maxVisibleButtons - (2 * visibleNeighbourButtonsRange + 1)) / 2)),
        pagesNumber);

    const leftThreeDotsPresent = !(leftButtonsR[leftButtonsR.length - 1] === middleButtonsR[0] - 1 || leftButtonsR.length === 0);
    const rightThreeDotsPresent = !(rightButtonsR[0] === middleButtonsR[middleButtonsR.length - 1] + 1 || rightButtonsR.length === 0);

    // TODO add tooltips
    const siteChangingController = (onclickF, label) => h('a.page-changing-controller', {onclick: onclickF}, label);

    return h('.flex-row', [
        'page:',
        // move to first page
        currentPage > 1 ? siteChangingController(() => data.changePage(1), '<<') : '',
        // move to middle of pages range [first, current]
        currentPage > 3 ? siteChangingController(() => data.changePage(Math.floor(currentPage / 2)), '|') : '',
        // move one page back
        currentPage > 1 ? siteChangingController(() => data.changePage(currentPage - 1), '<'): '',
        mapArrayToButtons(leftButtonsR),
        leftThreeDotsPresent ? '...' : '',
        mapArrayToButtons(middleButtonsR),
        rightThreeDotsPresent ? '...' : '',
        mapArrayToButtons(rightButtonsR),
        // analogically as above
        currentPage < pagesNumber ? siteChangingController(() => data.changePage(currentPage + 1), '>') : '',
        currentPage < pagesNumber - 2 ? siteChangingController(() => data.changePage(currentPage + Math.floor((pagesNumber - currentPage) / 2)), '|') : '',
        currentPage < pagesNumber ? siteChangingController(() => data.changePage(pagesNumber), '>>'): '',
    ]);

}
