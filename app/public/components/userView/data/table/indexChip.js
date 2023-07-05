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
import { RCT } from '../../../../config.js';

const { dataReqParams } = RCT;

export default function indexChip(model, index) {
    const dataPointer = model.getCurrentDataPointer();
    const data = model.fetchedData[dataPointer.page][dataPointer.index].payload;
    const { fields } = data;
    const firstField = fields.find((f) => f !== undefined && f.name);

    const chip = (pageName) => pageName !== 'periods' && model.fetchedData[pageName][index]
        ? h('.chip', {
            id: `chip-${pageName}-${index}`,
            class: dataPointer.index === index && dataPointer.page === pageName ? 'primary' : '',
        },
        h('button.btn.transparent', { onclick: () => {
            // eslint-disable-next-line max-len
            model.router.go(`/?page=${pageName}&index=${index}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-${firstField.name}`);
        } }, index),
        h('button.btn.icon-only-button.transparent', {
            onclick: () => {
                model.removeSubPage(pageName, index);
                model.notify();
            },
        }, h('.close-10')))
        : '';

    return chip(dataPointer.page);
}
