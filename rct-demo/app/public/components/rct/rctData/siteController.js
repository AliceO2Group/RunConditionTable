import button from "../../common/button.js";
import {range, replaceUrlParams} from "../../../utils/utils.js";


const visibleNeighbourButtonsRange = 2;
const maxVisibleButtons = 10;

export default function siteController(model, data) {
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
