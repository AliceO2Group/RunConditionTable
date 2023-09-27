/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. This software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

import { h } from '/js/src/index.js';
import { RCT } from '../../../config.js';
const { fieldNames: FN } = RCT;
const fieldNames = FN.runs;

/**
 * List of active columns for a generic runs table
 */
export const runsActiveColumns = {
    id: {
        name: 'id',
        visible: false,
    },

    run_number: {
        name: 'runNumber',
        visible: true,
        header: fieldNames.run_number.fieldName,
        fieldName: fieldNames.run_number.fieldName,
        filterInput: fieldNames.run_number.filterInput,
        format: (run) => h('td.text-ellipsis', run.run_number),
    },
};
