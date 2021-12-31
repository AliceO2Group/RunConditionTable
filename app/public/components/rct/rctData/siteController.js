import viewButton from "../../common/viewButton.js";
import {range, replaceUrlParams} from "../../../utils/utils.js";
import {h} from '/js/src/index.js';

const visibleNeighbourButtonsRange = 2;
const maxVisibleButtons = 10; // maximal number of visible buttons

/**
 * creates a container containing buttons handling changes of sites
 * @param model
 * @param data
 * @returns {*}
 */
export default function siteController(model, data) {
    const mapArrayToButtons = (arr) => arr.map(i => {
        const site = i + 1;
        const url = replaceUrlParams(data.url, [['site', site]]);
        return viewButton(model, site, () => model.fetchedData.changeSite(site), '', url.pathname + url.search, '', '.m1', true);
    })
    const sitesNumber = Math.ceil(data.totalRecordsNumber / data.rowsOnsite);
    const currentSite = Number(Object.fromEntries(data.url.searchParams.entries())['site']);
    const currentSiteIdx = currentSite - 1;

    const middleButtonsR = range(Math.max(0, currentSiteIdx - visibleNeighbourButtonsRange),
        Math.min(sitesNumber, currentSiteIdx + visibleNeighbourButtonsRange + 1));

    const leftButtonsR = range(0,
        Math.min(middleButtonsR[0], Math.floor((maxVisibleButtons - (2 * visibleNeighbourButtonsRange + 1)) / 2)));

    const rightButtonsR = range(Math.max(middleButtonsR[middleButtonsR.length - 1] + 1,
            sitesNumber - Math.floor((maxVisibleButtons - (2 * visibleNeighbourButtonsRange + 1)) / 2)),
        sitesNumber);

    const leftThreeDotsPresent = !(leftButtonsR[leftButtonsR.length - 1] === middleButtonsR[0] - 1 || leftButtonsR.length === 0);
    const rightThreeDotsPresent = !(rightButtonsR[0] === middleButtonsR[middleButtonsR.length - 1] + 1 || rightButtonsR.length === 0);

    // TODO add tooltips
    const siteChangingController = (onclickF, label) => h('a.site-changing-controller', {onclick: onclickF}, label);

    return h('.flex-row', [
        'site:',
        // move to first site
        currentSite > 1 ? siteChangingController(() => model.fetchedData.changeSite(1), '<<') : '',
        // move to middle of sites range [first, current]
        currentSite > 3 ? siteChangingController(() => model.fetchedData.changeSite(Math.floor(currentSite / 2)), '|') : '',
        // move one site back
        currentSite > 1 ? siteChangingController(() => model.fetchedData.changeSite(currentSite - 1), '<'): '',
        mapArrayToButtons(leftButtonsR),
        leftThreeDotsPresent ? '...' : '',
        mapArrayToButtons(middleButtonsR),
        rightThreeDotsPresent ? '...' : '',
        mapArrayToButtons(rightButtonsR),
        // analogically as above
        currentSite < sitesNumber ? siteChangingController(() => model.fetchedData.changeSite(currentSite + 1), '>') : '',
        currentSite < sitesNumber - 2 ? siteChangingController(() => model.fetchedData.changeSite(currentSite + Math.floor((sitesNumber - currentSite) / 2)), '|') : '',
        currentSite < sitesNumber ? siteChangingController(() => model.fetchedData.changeSite(sitesNumber), '>>'): '',
    ]);

}
