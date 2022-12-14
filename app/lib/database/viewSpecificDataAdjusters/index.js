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


const config = require('./../../config/configProvider.js');
const math = require('mathjs')
const { pagesNames: PN } = config.public;
const DRF = config.public.dataRespondFields;


const viewSpecificDataAdjusters = {};

viewSpecificDataAdjusters[PN.periods] = (data) => {
    data[DRF.rows] = data[DRF.rows].map((dataRow) => {
        let { energies } = dataRow;
        energies = energies?.filter((e) => e)
        dataRow.energy = (energies && energies.length) ? math.mean(energies) : null;
        delete dataRow.energies;
        return dataRow;
    });
    
    data[DRF.fields].find((f) => f.name == 'energies').name = 'energy';
    return data;
};

// viewSpecificDataAdjusters[PN.runsPerPeriod] = (data) => {

// };


module.exports = viewSpecificDataAdjusters;