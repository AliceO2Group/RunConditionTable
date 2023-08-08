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
import { RCT } from '../../../../config.js';
const { pageNames } = RCT;


export default function noDataView(model, dataPointer, anyFiltersActive) {
    const goBackBtn = h('button.btn.btn-primary.m3', {
        onclick: () => model.removeCurrentData(),
    }, 'Go back');

    const reloadBtn = h('button.btn.btn-primary.m3', {
        onclick: async () => {
            model.fetchedData.reqForData(true);
        },
    }, 'Reload');

    const clearFiltersBtn = h('button.btn.btn-secondary.m3', {
        onclick: () => {
            model.navigation.goToDefaultPageUrl(dataPointer.page);
        },
    }, 'Clear filters');

    const noDataMessage = h('h3', 'Nothing found');
    const noDataExplanation = h('h5', `${
        anyFiltersActive
            ? 'There is no data that matches your request'
            : dataPointer.page === pageNames.periods
                ? 'Please synchronize with outer services'
                : 'There is no data to be displayed here'
    }`);

    const noPeriodsView = h('.panel.top-100', [
        h('.synchronize-90'),
        noDataMessage,
        noDataExplanation,
        reloadBtn,
    ]);

    const noDataView = h('.panel.top-100', [
        h('.nothing-found-90'),
        noDataMessage,
        noDataExplanation,
        goBackBtn,
    ]);

    const noMatchingDataView = h('.panel.top-100', [
        h('.nothing-found-90'),
        noDataMessage,
        noDataExplanation,
        h('.flex-row',
            clearFiltersBtn,
            goBackBtn),
    ]);

    return anyFiltersActive
        ? noMatchingDataView
        : dataPointer.page === pageNames.periods
            ? noPeriodsView
            : noDataView;
}
