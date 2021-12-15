import {h, iconLayers, iconHome} from "/js/src/index.js";
import fetchedDataSection from "./fetchedDataSection.js";
import aloneSectionButton from "./aloneSectionButton.js";

function pathNQuery(section, index, view) {
    return `/api/Rct-Data/?section=${section}&index=${index}&view=${view}&rowsOnPage=50&page=1`;
}

/**
 * Provides navigation between particular views, is divide to sections,
 * each may contain many buttons corresponding to many fetched data
 * @param model
 * @returns {*}
 */
export default function sidebar(model) {
    return h('nav.sidebar.sidebar-content.scroll-y.flex-column', [
        sidebarMenu(model)
      ]);
}

const sidebarMenu = (model) => [
    aloneSectionButton(model, 'Periods', 'periods', '_0', 'periods'),
    fetchedDataSection(model, 'runsPerPeriod', 'Runs per period'),
    aloneSectionButton(model, "Monte Carlo", 'mc', '_0', 'mc'),
    fetchedDataSection(model, 'flags', 'QA Expert Flagging'),
];
