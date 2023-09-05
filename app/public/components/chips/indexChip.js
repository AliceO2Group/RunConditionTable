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

/**
 * @param {Observable} model - provides a set of functions
 * @param {string} pageName - name of the page
 * @param {string} index - index of the item on page
 * @returns {vnode} button that navigates user to the related (page, index) view
 */

export default function indexChip(model, pageName, index) {
    const dataPointer = model.getCurrentDataPointer();
    const currentPage = dataPointer.page;

    return currentPage !== pageNames.periods && model.fetchedData[currentPage][index] && currentPage === pageName
        ? h('.chip.flex-wrap.justify-between.items-center', {
            id: `chip-${currentPage}-${index}`,
            class: dataPointer.index === index ? 'primary' : '',
        },
        h('button.btn.transparent', { onclick: () => {
            model.navigation.go(currentPage, index);
        } }, index),
        h('button.btn.icon-only-button.transparent', {
            onclick: () => {
                model.removeSubPage(currentPage, index);
                model.notify();
            },
        }, dataPointer.index === index ? h('.close-20-off-white') : h('.close-20-primary')))
        : '';
}
