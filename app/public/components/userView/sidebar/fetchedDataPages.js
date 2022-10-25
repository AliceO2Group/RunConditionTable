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
import { multiButtonController } from './multiButtonController.js';

export default function fetchedDataPages(model, pageName, label) {
    const dataSubsetForPage = model.fetchedData[pageName];
    const buttons = [];

    const labelWithChevron = model.router.params.page === pageName
        ? h('div',
        h('div.vertical-center', 
            h('div.current-page',
                h('div.title-text-relative.hidden', label)
            )),
            h('div.chevron-right-30.vertical-center'),
            h('div.title-text.vertical-center', label),
        )
        : h('div',
            h('div.chevron-down-30.vertical-center'),
            h('div.title-text.vertical-center', label));

    if (pageName) {
        for (const index in dataSubsetForPage) {
            if (dataSubsetForPage[index]) {
                buttons.push(multiButtonController(model, pageName, index));
            }
        }
    }
    return h('.flex-wrap', [
        h('.page-title',
            { class: model.router.params.page === pageName ? 'selected' : '' },
            labelWithChevron
        ),
            h('.flex-wrap.item-center.justify-center', [h('.flex-column', buttons)],)
    ]);
}
