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
import fields from './fields.js';

export default function flagsTableRow(
    model, item, cellsSpecials,
) {
    const displayedFields = fields.filter((e) => e.display === true);

    const dataCells = displayedFields.map((field) =>
        h(`td.${model.getCurrentDataPointer().page}-${field.name}-cell.text-ellipsis`,
            item[field.name]
                ? cellsSpecials[field.name]
                    ? cellsSpecials[field.name](model, item)
                    : item[field.name]
                : '..'));

    return h('tr.track.row-not-selected', dataCells);
}
