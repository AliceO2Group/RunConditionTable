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
import flagsTableHeader from '../table/flagsTableHeader.js';
import flagsTableRow from '../table/flagsTableRow.js';
import pagesCellsSpecials from '../../userView/data/pagesCellsSpecials.js';
const { pageNames: PN } = RCT;

export default function flagsTable(model, flagsData) {
    const cellsSpecials = pagesCellsSpecials[PN.flags];

    return flagsData.length > 0
        ? h('.p-top-10',
            h('.x-scrollable-table.border-sh',
                h('table', {
                    id: 'flags-data-table',
                    className: 'flags-table',
                }, [
                    flagsTableHeader(model),

                    h('tbody', { id: 'table-body-flagsData' },
                        flagsData.map((item) => flagsTableRow(
                            PN.flags, item, cellsSpecials,
                        ))),
                ])))
        : '';
}
