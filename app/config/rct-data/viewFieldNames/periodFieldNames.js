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

const periodFieldNames = {
    name: {
        fieldName: 'Name',
        filterInput: filterInputTypes.text,
    },
    beamType: {
        fieldName: 'Beam',
        filterInput: filterInputTypes.text,
    },
    year: {
        fieldName: 'Year',
        filterInput: filterInputTypes.number,
    },
    avgEnergy: {
        fieldName: 'Mean energy [GeV]',
        filterInput: filterInputTypes.number,
    },
    distinctEnergies: {
        fieldName: 'Run energies [GeV]',
        filterInput: filterInputTypes.number,
    },
};

module.exports = periodFieldNames;
