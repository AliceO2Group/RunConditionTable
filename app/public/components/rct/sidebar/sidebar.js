import {h} from "/js/src/index.js";
import fetchedDataPages from "./fetchedDataPages.js";
import alonePageButton from "./alonePageButton.js";
import applicationProperties from "../../../applicationProperties.js";
const pagesNames = applicationProperties.pagesNames;

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
const sidebarMenu = (model) => {

    return [
        alonePageButton(model, 'Periods', pagesNames.periods),
        fetchedDataPages(model, pagesNames.dataPasses, "Data Passes"),
        fetchedDataPages(model, pagesNames.mc, "Monte Carlo"),
        fetchedDataPages(model, pagesNames.runsPerPeriod, 'Runs per period'),
        fetchedDataPages(model, pagesNames.flags, 'QA Expert Flagging'),
    ]
};
