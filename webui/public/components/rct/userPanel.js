import { h } from '/js/src/index.js';
import { goodBadOpt } from '../../utils/utils.js';
import RCTHomepage from './homePage.js';
import header from '../common/header.js';

export default function userPanel(model) {
    return h('.flex-column.absolute-fill', [
        // menu bar
        header(model),
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
