/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

import { h } from '/js/src/index.js';
import { RCT } from '../../config.js';
const { pageNames } = RCT;

export default function sidebarItem(model, pageName, label) {
    const subPagesCount = model.getSubPagesCount(pageName);
    const displayedSubPagesCount = subPagesCount > 0 ? ` (${subPagesCount})` : '';

    const icon = () => {
        switch (pageName) {
            case pageNames.periods: return h('.periods-15-off-white.vertical-center');
            case pageNames.dataPasses: return h('.data-passes-15-off-white.vertical-center');
            case pageNames.anchoragePerDatapass: return h('.anchorage-per-dp-15-off-white.vertical-center');
            case pageNames.mc: return h('.mc-15-off-white.vertical-center');
            case pageNames.anchoredPerMC: return h('.anchored-per-mc-15-off-white.vertical-center');
            case pageNames.runsPerPeriod: return h('.runs-per-period-15-off-white.vertical-center');
            case pageNames.runsPerDataPass: return h('.runs-per-dp-15-off-white.vertical-center');
            case pageNames.flags: return h('.qa-15-off-white.vertical-center');
            default: return h('.folder-15-off-white.vertical-center');
        }
    };

    return h(`button.sidebar-item-button${model.router.params.page === pageName ? '.current-page' : ''}`, {
        class: model.router.params.page === pageName ? 'selected' : '',
        onclick: () => model.navigation.goToDefaultPageUrl(pageName),
    }, h('.page-title',
        icon(),
        h('.title-text.vertical-center.hide-on-close', label, displayedSubPagesCount)));
}
