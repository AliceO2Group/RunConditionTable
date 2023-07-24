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
import subPagesCount from './subPagesCount.js';

export default function sidebarItem(model, pageName, label) {
    return h('.flex-wrap', [
        h('.page-title', {
            class: model.router.params.page === pageName ? 'selected' : '',
            onclick: () => model.navigation.goToDefaultPageUrl(pageName),
        },
        model.router.params.page === pageName
            ? h('div',
                h('.vertical-center',
                    h('.current-page',
                        h('.title-text-relative.hidden', label))),
                h('.folder-20.vertical-center'),
                h('.title-text.vertical-center', label, subPagesCount(model, pageName)))
            : h('div',
                h('.folder-20.vertical-center'),
                h('.title-text.vertical-center', label, subPagesCount(model, pageName)))),
    ]);
}
