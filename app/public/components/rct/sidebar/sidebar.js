import {h, iconLayers, iconHome} from "/js/src/index.js";
import fetchedDataPages from "./fetchedDataPages.js";
import alonePageButton from "./alonePageButton.js";

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
    alonePageButton(model, 'Periods', 'periods', '_0'),
    fetchedDataPages(model, 'dataPasses', "Data Passes"),
    fetchedDataPages(model, 'mc', "Monte Carlo"),
    fetchedDataPages(model, 'runsPerPeriod', 'Runs per period'),
    fetchedDataPages(model, 'flags', 'QA Expert Flagging'),
];
