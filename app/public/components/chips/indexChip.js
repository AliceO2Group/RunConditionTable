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
const { dataReqParams, pageNames } = RCT;

export default function indexChip(model, pageName, index) {
    const dataPointer = model.getCurrentDataPointer();
    const currentPage = dataPointer.page;
    const data = model.fetchedData[currentPage][dataPointer.index].payload;
    const { fields } = data;
    const firstField = fields.find((f) => f !== undefined && f.name);
    const targetUrl = `/?page=${currentPage}&index=${index}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-${firstField.name}`;

    return currentPage !== pageNames.periods && model.fetchedData[currentPage][index] && currentPage === pageName
        ? h('.chip.flex-wrap.justify-between.items-center', {
            id: `chip-${currentPage}-${index}`,
            class: dataPointer.index === index ? 'primary' : '',
        },
        h('button.btn.transparent', { onclick: () => {
            model.router.go(targetUrl);
        } }, index),
        h('button.btn.icon-only-button.transparent', {
            onclick: () => {
                model.removeSubPage(currentPage, index);
                model.notify();
            },
        }, dataPointer.index === index ? h('.close-20-off-white') : h('.close-20-primary')))
        : '';
}
