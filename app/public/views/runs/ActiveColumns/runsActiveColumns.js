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
import { dateFormatter } from '../../../utils/dataProcessing/dataProcessingUtils.js';
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

    startTime: {
        name: 'startTime',
        visible: true,
        header: fieldNames.start_time.fieldName,
        fieldName: fieldNames.start_time.fieldName,
        filterInput: fieldNames.start_time.filterInput,
        format: (_, run) => h('',
            h('.skinny', dateFormatter(run.startTime).dateString),
            dateFormatter(run.startTime).timeString),
    },

    endTime: {
        name: 'endTime',
        visible: true,
        header: fieldNames.end_time.fieldName,
        fieldName: fieldNames.end_time.fieldName,
        filterInput: fieldNames.end_time.filterInput,
        format: (_, run) => h('',
            h('.skinny', dateFormatter(run.endTime).dateString),
            dateFormatter(run.endTime).timeString),
    },

    timeO2Start: {
        name: 'timeO2Start',
        visible: true,
        header: fieldNames.time_o2_start.fieldName,
        fieldName: fieldNames.time_o2_start.fieldName,
        filterInput: fieldNames.time_o2_start.filterInput,
        format: (_, run) => h('',
        h('.skinny', dateFormatter(run.timeO2Start).dateString),
        dateFormatter(run.timeO2Start).timeString),
    },

    timeO2End: {
        name: 'timeO2End',
        visible: true,
        header: fieldNames.time_o2_end.fieldName,
        fieldName: fieldNames.time_o2_end.fieldName,
        filterInput: fieldNames.time_o2_end.filterInput,
        format: (_, run) => h('',
            h('.skinny', dateFormatter(run.timeO2End).dateString),
            dateFormatter(run.timeO2End).timeString),
    },

    timeTrgStart: {
        name: 'timeTrgStart',
        visible: true,
        header: fieldNames.time_trg_start.fieldName,
        fieldName: fieldNames.time_trg_start.fieldName,
        filterInput: fieldNames.time_trg_start.filterInput,
        format: (_, run) => h('',
            h('.skinny', dateFormatter(run.timeTrgStart).dateString),
            dateFormatter(run.timeTrgStart).timeString),
    },

    timeTrgEnd: {
        name: 'timeTrgEnd',
        visible: true,
        header: fieldNames.time_trg_end.fieldName,
        fieldName: fieldNames.time_trg_end.fieldName,
        filterInput: fieldNames.time_trg_end.filterInput,
        format: (_, run) => h('',
            h('.skinny', dateFormatter(run.timeTrgEnd).dateString),
            dateFormatter(run.timeTrgEnd).timeString),
    },

    runDuration: {
        name: 'runDuration',
        visible: true,
        header: fieldNames.run_duration.fieldName,
        fieldName: fieldNames.run_duration.fieldName,
        filterInput: fieldNames.run_duration.filterInput,
        format: (_, run) => run.runDuration,
    },

    dipoleCurrentVal: {
        name: 'dipoleCurrentVal',
        visible: true,
        header: fieldNames.dipole_current.fieldName,
        fieldName: fieldNames.dipole_current.fieldName,
        filterInput: fieldNames.dipole_current.filterInput,
        format: (_, run) => run.dipoleCurrentVal,
    },

    lhcBeamEnergy: {
        name: 'lhcBeamEnergy',
        visible: true,
        header: fieldNames.lhc_beam_energy.fieldName,
        fieldName: fieldNames.lhc_beam_energy.fieldName,
        filterInput: fieldNames.lhc_beam_energy.filterInput,
        format: (_, run) => run.lhcBeamEnergy,
    },

    l3CurrentVal: {
        name: 'l3CurrentVal',
        visible: true,
        header: fieldNames.l3_current_val.fieldName,
        fieldName: fieldNames.l3_current_val.fieldName,
        filterInput: fieldNames.l3_current_val.filterInput,
        format: (_, run) => run.l3CurrentVal,
    },

    fillNumber: {
        name: 'fillNumber',
        visible: true,
        header: fieldNames.fill_number.fieldName,
        fieldName: fieldNames.fill_number.fieldName,
        filterInput: fieldNames.fill_number.filterInput,
        format: (_, run) => run.fillNumber,
    },
};
/*
center of mass energy??
IR ??

const runFieldNames = {
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
};
*/
