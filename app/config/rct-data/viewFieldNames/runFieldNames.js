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
const { filterInputTypes } = require('../filterTypes.js');

const runFieldNames = {
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
        filterInput: filterInputTypes.date,
    },
    time_end: {
        fieldName: 'End time',
        filterInput: filterInputTypes.date,
    },
    time_trg_start: {
        fieldName: 'Trigger start',
        filterInput: filterInputTypes.date,
    },
    time_trg_end: {
        fieldName: 'Trigger end',
        filterInput: filterInputTypes.date,
    },
    center_of_mass_energy: {
        fieldName: 'Center of mass energy',
        filterInput: filterInputTypes.number,
    },
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

module.exports = runFieldNames;
