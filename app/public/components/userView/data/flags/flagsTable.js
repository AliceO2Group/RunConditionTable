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
import flagsTableHeader from './table/flagsTableHeader.js';
import flagsTableRow from './table/flagsTableRow.js';
import pagesCellsSpecials from '../pagesCellsSpecials.js';
const { pagesNames: PN } = RCT;

export default function flagsTable(model, run, detector) {
    const [flagsDataIndex] = Object.keys(model.fetchedData[PN.flags]);
    const { rows } = model.fetchedData[PN.flags][flagsDataIndex].payload;
    const cellsSpecials = pagesCellsSpecials[PN.flags];

    if (!Array.isArray(rows)) {
        return '';
    }

    const flagsData = rows.filter((e) => e.detector === detector && e.run_number.toString() === run.toString());

    return flagsData.length > 0
        ? h('.p-top-10',
            h('.x-scrollable-table.border-sh',
                h('table', {
                    id: 'flags-data-table',
                    className: 'flags-table',
                }, [
                    flagsTableHeader(flagsData, model),

                    h('tbody', { id: 'table-body-flagsData' },
                        flagsData.map((item) => flagsTableRow(
                            model, flagsData, item, cellsSpecials,
                        ))),

                ])))
        : '';
}
