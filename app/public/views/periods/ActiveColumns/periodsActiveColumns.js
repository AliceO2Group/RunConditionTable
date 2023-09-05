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
import { href } from '../../../utils/url/urlUtils.js';
const { dataReqParams: DRP, pageNames: PN } = RCT;
const acceptableEnergyValues = RCT.mapping.energy.values;
const acceptableEnergyMargin = RCT.mapping.energy.acceptableMargin;

/**
 * List of active columns for a generic periods table
 */
export const periodsActiveColumns = {
    id: {
        name: 'Id',
        visible: false,
    },

    name: {
        name: 'Name',
        visible: true,
        format: (navigation, period) => [
            h('td.text-ellipsis', period.name),
            h('td',
                linkChip(
                    navigation,
                    'runs',
                    href(PN.runsPerPeriod, {
                        index: period.name,
                        [DRP.itemsPerPage]: navigation.model.userPreferences.itemsPerPage,
                        [DRP.pageNumber]: 1,
                        sorting: '-run_number',
                    }),
                ),

                linkChip(
                    navigation,
                    'data passes',
                    href(PN.dataPasses, {
                        index: period.name,
                        [DRP.itemsPerPage]: navigation.model.userPreferences.itemsPerPage,
                        [DRP.pageNumber]: 1,
                    }),
                ),

                linkChip(
                    navigation,
                    'MC',
                    href(PN.mc, {
                        index: period.name,
                        [DRP.itemsPerPage]: navigation.model.userPreferences.itemsPerPage,
                        [DRP.pageNumber]: 1,
                    }),
                )),
        ],
    },

    beamType: {
        name: 'Beam',
        visible: true,
        format: (_, period) => period.beamType,
    },

    year: {
        name: 'Year',
        visible: true,
        format: (_, period) => period.year,
    },

    avgEnergy: {
        name: 'Mean energy',
        visible: true,
        format: (_, period) => `${Number(period.avgEnergy).toFixed(2)}`,
    },

    distinctEnergies: {
        name: 'Distinct energies',
        visible: true,
        format: (_, period) =>
            h('', period.distinctEnergies.map((e) => getClosestDefinedEnergy(e, acceptableEnergyValues, acceptableEnergyMargin))
                .filter((value, index, array) => array.indexOf(value) === index)
                .reduce((toDisplay, currentValue) => `${toDisplay ? `${toDisplay}, ` : ''}${currentValue}`, '')),
    },
};
