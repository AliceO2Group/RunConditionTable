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
import flagsVisualization from '../../../components/flags/flagsVisualization.js';
import flagsTable from './flagsTable.js';
import flagBreadCrumbs from '../../../../components/flags/flagBreadcrumbs.js';
import { noRunNumbers } from '../../../../utils/defaults.js';
import noSubPageSelected from '../../userView/data/table/noSubPageSelected.js';
import dataActionButtons, { dataActions } from '../../../components/buttons/dataActionButtons.js';

const applicableDataActions = {
    [dataActions.hide]: false,
    [dataActions.reload]: true,
    [dataActions.obsoleteDownloadCSV]: true,
    [dataActions.downloadCSV]: false,
    [dataActions.copyLink]: true,
    [dataActions.showFilteringPanel]: false,
};

export default function flagsContent(model, runs, detectors, flags) {
    const urlParams = model.router.getUrl().searchParams;

    const dataPassName = urlParams.get('data_pass_name');
    const runNumber = urlParams.get('run_numbers');
    const detector = urlParams.get('detector');

    const detectorName = detectors.getDetectorName(detector);
    const flagsData = flags.getFlags(runNumber, detectorName);
    const runData = runs.getRun(dataPassName, runNumber);

    return runNumber > noRunNumbers && runData
        ? h('.p-1rem', [
            h('.flex-wrap.justify-between.items-center',
                h('.flex-wrap.justify-between.items-center',
                    flagBreadCrumbs(model, dataPassName, runNumber, detectorName)),

                dataActionButtons(model, applicableDataActions)),

            flagsVisualization(runData, flagsData),
            flagsTable(model, flagsData),
        ])
        : noSubPageSelected(model);
}
