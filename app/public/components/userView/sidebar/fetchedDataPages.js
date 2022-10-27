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

export default function fetchedDataPages(model, pageName, label, toggle) {
    // Let toggle = model.router.params.page === pageName;
    const dataSubsetForPage = model.fetchedData[pageName];
    const buttons = [];

    const labelWithChevron = model.router.params.page === pageName
        ? h('div',
            h('.vertical-center',
                h('.current-page',
                    h('.title-text-relative.hidden', label))),
            h('.chevron-right-20.vertical-center', { id: `${pageName}ToggleChevron` }),
            h('.title-text.vertical-center', label))
        : h('div',
            h('.chevron-down-20.vertical-center', { id: `${pageName}ToggleChevron` }),
            h('.title-text.vertical-center', label));

    if (pageName) {
        for (const index in dataSubsetForPage) {
            if (dataSubsetForPage[index]) {
                buttons.push(multiButtonController(model, pageName, index));
            }
        }
    }

    function handleToggle() {
        toggle = !toggle;
        const x = document.getElementById(`${pageName}ToggleHide`);
        if (x.classList.contains('none')) {
            x.classList.add('flex');
            x.classList.remove('none');
        } else {
            x.classList.add('none');
            x.classList.remove('flex');
        }
        const chevr = document.getElementById(`${pageName}ToggleChevron`);
        if (chevr.classList.contains('chevron-right-20')) {
            chevr.classList.remove('chevron-right-20');
            chevr.classList.add('chevron-down-20');
        } else {
            chevr.classList.remove('chevron-down-20');
            chevr.classList.add('chevron-right-20');
        }
    }

    return h('.flex-wrap', [
        h('.page-title',
            { class: model.router.params.page === pageName ? 'selected' : '',
                onclick: () => handleToggle(),
            },
            labelWithChevron),
        toggle ? h('.flex-wrap.item-center.justify-center.flex', { id: `${pageName}ToggleHide` }, [h('.flex-column', buttons)]) : h('.flex-wrap.item-center.justify-center.none', { id: `${pageName}ToggleHide` }, [h('.flex-column', buttons)]),
    ]);
}
