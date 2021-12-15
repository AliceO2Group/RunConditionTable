import {h, iconLayers, iconHome} from "/js/src/index.js";
import fetchedDataSection from "./fetchedDataSection.js";

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
    h('.menu-title', {
      class: model.router.params.section === 'home' ? 'currentMenuItem' : ''
    }, 'Home'),
    h('a.menu-item', {
      title: 'Home',
      style: 'display:flex',
      href: '/home/?section=home',
      onclick: (e) => model.router.handleLinkEvent(e),
      class: model.router.params.section === 'home' ? 'myActiveButton' : ''
    }, [
      h('span', iconHome(), ' ', 'Main (home) page')
    ]),

    h('.menu-title', {
      class: model.router.params.section === 'periods' ? 'currentMenuItem' : ''
    }, 'Periods'),
    h('a.menu-item', {
        title: 'Periods',
        style: 'display:flex',
        href: pathNQuery('periods', '_0', 'periods'),
        onclick: (e) => model.router.handleLinkEvent(e),
        class: model.router.params.section === 'main' ? 'myActiveButton' : ''
      }, [
        h('span', iconLayers(), ' ', 'Periods')
    ]),

    fetchedDataSection(model, 'runsPerPeriod', 'Runs per period'),

    h('.menu-title', {
      class: model.router.params.section === 'mc' ? 'currentMenuItem' : ''
    }, 'Monte Carlo'),
    h('a.menu-item', {
        title: 'Monte Carlo',
        style: 'display:flex',
        href: pathNQuery('mc', '_0', 'mc'),
        onclick: (e) => model.router.handleLinkEvent(e),
        class: model.router.params.section === 'mc' ? 'myActiveButton' : ''
      }, [
        h('span', iconLayers(), ' ', 'Monte Carlo simulations')
    ]),

    fetchedDataSection(model, 'flags', 'QA Expert Flagging'),
];
