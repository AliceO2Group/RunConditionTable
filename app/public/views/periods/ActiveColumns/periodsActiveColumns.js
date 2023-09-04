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
import linkChip from '../../../components/chips/linkChip.js';
import { RCT } from '../../../config.js';
import { getClosestDefinedEnergy } from '../../../utils/dataProcessing/dataProcessingUtils.js';
const { dataReqParams: DRP, pageNames: PN } = RCT;
const acceptableEnergyValues = RCT.mapping.energy.values;
const acceptableEnergyMargin = RCT.mapping.energy.acceptableMargin;

/**
 * List of active columns for a generic periods table
 */
export const periodsActiveColumns = {
    name: {
        name: 'Name',
        visible: true,
        format: (navigation, period) => [
            h('td.text-ellipsis', period.name),
            h('td',
                linkChip(
                    navigation,
                    'runs',
                    // eslint-disable-next-line max-len
                    `/?page=${PN.runsPerPeriod}&index=${period.name}&${DRP.itemsPerPage}=${model.userPreferences.itemsPerPage}&${DRP.pageNumber}=1&sorting=-run_number`,
                ),

                linkChip(
                    navigation,
                    'data passes',
                    // eslint-disable-next-line max-len
                    `/?page=${PN.dataPasses}&index=${period.name}&${DRP.itemsPerPage}=${model.userPreferences.itemsPerPage}&${DRP.pageNumber}=1`,
                ),

                linkChip(
                    navigation,
                    'MC',
                    `/?page=${PN.mc}&index=${period.name}&${DRP.itemsPerPage}=${model.userPreferences.itemsPerPage}&${DRP.pageNumber}=1`,
                )),
        ],
    },

    beamType: {
        name: 'Beam',
        visible: true,
        format: (_model, period) => period.beamType,
    },

    year: {
        name: 'Year',
        visible: true,
        format: (_model, period) => period.year,
    },

    avgEnergy: {
        name: 'Mean energy',
        visible: true,
        format: (_model, period) => `${Number(period.avgEnergy).toFixed(2)}`,
    },

    distinctEnergies: {
        name: 'Distinct energies',
        visible: true,
        format: (_model, period) =>
            h('', period.distinctEnergies.map((e) => getClosestDefinedEnergy(e, acceptableEnergyValues, acceptableEnergyMargin))
                .filter((value, index, array) => array.indexOf(value) === index)
                .reduce((toDisplay, currentValue) => `${toDisplay ? `${toDisplay}, ` : ''}${currentValue}`, '')),
    },
};
