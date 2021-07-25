import { h } from '/js/src/index.js';
import { goodBadOpt } from '../../utils/utils.js';
import { timeServerContent } from "../timeServer/timeServerView.js";
import RCTHomepage from './homePage.js';

export default function userPanel(model) {
    return h('.flex-column.absolute-fill', [
        // menu bar
        h('.bg-white.flex-row.p2.shadow-level2.level2', {id: 'menu'}, [
            h('.flex-grow.text-left', [
                h('button.btn', {onclick: e => alert('TODO')}, 'opts')
            ]), ' ',
            h('.w-50.text-center', [
                h('h4.primary', 'TEST APP PANEL')
            ]), ' ',
            h('.flex-grow', [
                h('input', {id: 'main-panel-search', placeholder: 'search', type: 'input'})
            ]), ' ',
            h('flex-grow.text-right', [
                h('button.btn', {onclick: e => model.logout()}, 'logout')
            ]),
        ]),
        // content below menu bar
        h('.flex-grow.flex-row', [
            // sidebar
            h('.sidebar.flex-column.bg-gray-lighter', [
                h(goodBadOpt('button.btn.p2.m2', ['.btn-success'], ['.btn-primary'], [!model.RCTHomepageVisible]),
                    {id: 'RCT-main-show-btn', onclick: e => model.showHideRCTHomepage()}, 'RCT main'), ' ',
            ]), ' ',
            // content
            h('.flex-grow.relative', [
                h('.scroll-y.absolute-fill.bg-white', {id: 'main-content'}, [
                    model.contentVisibility.RCTHomepageVisible ? RCTHomepage(model) : '',
                ])
            ])
        ])
    ])
}
