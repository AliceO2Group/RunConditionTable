import {h, iconLayers, iconHome} from "/js/src/index.js";

/**
 * Provides navigation between particular views, is divide to sections,
 * each may contain many buttons corresponding to many fetched data
 * @param model
 * @returns {*}
 */

export default function hierarchicalSidebar(model) {
    return h('nav.sidebar.sidebar-content.scroll-y.flex-column', [
        sidebarMenu(model)
    ]);
}

const sidebarMenu = (model) => [
];
