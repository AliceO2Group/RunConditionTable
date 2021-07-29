import { h } from '/js/src/index.js';
import { goodBadOpt } from '../../utils/utils.js';
import RCTHomepage from './homePage.js';
import header from '../common/header.js';
import button from '../common/button.js';

const handleClick = (model, e) => {
    model.router.handleLinkEvent(e);
    model.notify();
}

const menu = (model) => h('.mySidebar.flex-column.bg-gray-lighter', [
    h(goodBadOpt('button.btn.p2.m2', ['.btn-success'], ['.btn-primary'], [!model.RCTHomepageVisible]),
    {id: 'RCT-main-show-btn', onclick: e => model.showHideRCTHomepage()}, 'Show data'), ' ',
    h('a.myFinalButton', {onclick: (e) => {model.router.handleLinkEvent(e); model.notify();}, href: '?page=periods'}, 'RCT Home page'),
    h('a.myFinalButton', {onclick: (e) => {model.router.handleLinkEvent(e); model.notify();}, href: '?page=item&id=1'}, 'Item 1'),
    h('a.myFinalButton', {onclick: (e) => model.router.handleLinkEvent(e), href: '?page=item&id=2'}, 'Item 2'),
    h('a.myFinalButton', {onclick: (e) => model.router.handleLinkEvent(e), href: '?page=item&id=3'}, 'Item 3'),
    button('Period view', () => {return undefined;}),
    button('Period view', () => {return undefined;}),
    button('Runs per period view', () => {return undefined;}),
    button('Alternative layout', () => {return undefined;}),
    button('Data or MC', () => {return undefined;}),
    button('Pass QA Statistics Summary', () => {return undefined;}),
    button('QA Expert Flagging', () => {return undefined;}),
]);

export default function userPanel(model) {
    return h('.flex-column.absolute-fill', [
        header(model),
        // content below menu bar
        h('.flex-grow.flex-row', [
            // sidebar
            menu(model),
            
            // content
            h('.flex-grow.relative', [
                h('.scroll-y.absolute-fill.bg-white', {id: 'main-content'}, [
                    model.contentVisibility.RCTHomepageVisible ? RCTHomepage(model) : '',
                ])
            ])
        ])
    ])
}
