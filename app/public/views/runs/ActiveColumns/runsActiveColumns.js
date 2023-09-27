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

    runNumber: {
        name: 'runNumber',
        visible: true,
        header: fieldNames.run_number.fieldName,
        fieldName: fieldNames.run_number.fieldName,
        filterInput: fieldNames.run_number.filterInput,
        format: (_, run) => run.runNumber,
    },

    timeO2Start: {
        name: 'timeO2Start',
        visible: true,
        header: fieldNames.time_o2_start.fieldName,
        fieldName: fieldNames.time_o2_start.fieldName,
        filterInput: fieldNames.time_o2_start.filterInput,
        format: (_, run) => run.timeO2Start,
    },

    timeO2End: {
        name: 'timeO2End',
        visible: true,
        header: fieldNames.time_o2_end.fieldName,
        fieldName: fieldNames.time_o2_end.fieldName,
        filterInput: fieldNames.time_o2_end.filterInput,
        format: (_, run) => run.timeO2End,
    },

    timeTrgStart: {
        name: 'timeTrgStart',
        visible: true,
        header: fieldNames.time_trg_start.fieldName,
        fieldName: fieldNames.time_trg_start.fieldName,
        filterInput: fieldNames.time_trg_start.filterInput,
        format: (_, run) => run.timeTrgStart,
    },

    timeTrgEnd: {
        name: 'timeTrgEnd',
        visible: true,
        header: fieldNames.time_trg_end.fieldName,
        fieldName: fieldNames.time_trg_end.fieldName,
        filterInput: fieldNames.time_trg_end.filterInput,
        format: (_, run) => run.timeTrgEnd,
    },

    dipoleCurrentVal: {
        name: 'dipoleCurrentVal',
        visible: true,
        header: fieldNames.dipole_current.fieldName,
        fieldName: fieldNames.dipole_current.fieldName,
        filterInput: fieldNames.dipole_current.filterInput,
        format: (_, run) => run.dipoleCurrentVal,
    },
};
/*
const runFieldNames = {
    center_of_mass_energy: {
        fieldName: 'Center of mass energy',
        filterInput: filterInputTypes.number,
    }, ??
    ir: {
        fieldName: 'IR [Hz]',
        filterInput: filterInputTypes.number,
    },
    filling_scheme: {
        fieldName: 'Filling scheme',
        filterInput: filterInputTypes.text,
    },
    triggers_conf: {
        fieldName: 'Triggers configuration',
        filterInput: filterInputTypes.text,
    },
    fill_number: {
        fieldName: 'Fill number',
        filterInput: filterInputTypes.number,
    },
    run_type: {
        fieldName: 'Run type',
        filterInput: filterInputTypes.text,
    },
    mu: {
        fieldName: '\u03BC',
        filterInput: filterInputTypes.number,
    },
    l3_current: {
        fieldName: 'L3 current [A]',
        filterInput: filterInputTypes.number,
    },
    dipole_current: {
        fieldName: 'Dipole current [A]',
        filterInput: filterInputTypes.number,
    },
};
*/
