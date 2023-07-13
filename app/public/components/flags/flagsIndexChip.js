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

export default function flagsIndexChip(model, targetPage, label) {
    return h('.chip', {
        id: `chip-${targetPage}-${label}`,
    },
    h('button.btn.transparent', { onclick: () => {
        // TODO once url scheme is confirmed
        // eslint-disable-next-line max-len
        // Model.router.go(`/?page=${targetPage}&index=${index}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-${firstField.name}`);
        history.back();
    } }, label));
}
