import {h, iconLayers, iconHome} from "/js/src/index.js";
import fetchedDataSection from "./fetchedDataSection.js";
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
    fetchedDataSection(model, 'dataPasses', "Data Passes"),
    fetchedDataSection(model, 'mc', "Monte Carlo"),
    fetchedDataSection(model, 'runsPerPeriod', 'Runs per period'),
    fetchedDataSection(model, 'flags', 'QA Expert Flagging'),
];
