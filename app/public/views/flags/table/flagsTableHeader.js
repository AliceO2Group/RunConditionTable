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
import { getHeaderSpecial, headerSpecPresent, nonDisplayable } from '../../userView/data/headersSpecials.js';
import fields from './fields.js';
const RCT = window.RCT_CONF;

export default function flagsTableHeader(model) {
    const displayedFields = fields.filter((e) => e.display === true);
    const columnsHeadersArray = (fields, model) =>
        fields.map((f) => [
            h(`th.${RCT.pageNames.flags}-${f.name}-header`, {
                scope: 'col',
            }, h('.relative', [
                headerSpecPresent(model, f) !== nonDisplayable ?
                    h('.inline', getHeaderSpecial(model, f))
                    : '',
            ])),
        ]);

    return h('thead.header',
        h('tr', columnsHeadersArray(displayedFields, model)));
}
