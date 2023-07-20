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
const viewTypes = require('./viewTypes.js');
const { filterInputTypes } = require('./filterTypes.js');
const { periodFieldNames } = require('./viewFieldNames');

const fieldNames = {};

const runFields = {
    name: {
        fieldName: 'Name',
        filterInput: filterInputTypes.text,
    },
    run_number: {
        fieldName: 'Run',
        filterInput: filterInputTypes.number,
    },
    time_start: {
        fieldName: 'Start time',
    },
    time_end: {
        fieldName: 'End time'
    },
    time_trg_start: {
        fieldName: 'Trigger start'
    },
    time_trg_end: {
        fieldName: 'Trigger end'
    },
    center_of_mass_energy: {
        fieldName: 'Center of mass energy'
    },
    ir: {
        fieldName: 'IR [Hz]'
    },
    filling_scheme: {
        fieldName: 'Filling scheme'
    },
    triggers_conf: {
        fieldName: 'Triggers configuration'
    },
    fill_number: {
        fieldName: 'Fill number'
    },
    run_type: {
        fieldName: 'Run type'
    },
    mu: {
        fieldName: '\u03BC'
    },
    l3_current: {
        fieldName: 'L3 current [A]'
    },
    dipole_current: {
        fieldName: 'Dipole current [A]'
    },
}

fieldNames[viewTypes.periods] = periodFieldNames;
fieldNames[viewTypes.runs] = runFields;

module.exports = fieldNames;
