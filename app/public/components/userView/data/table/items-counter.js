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

import { RCT } from '../../../../config.js';

const siteParamName = RCT.dataReqParams.site;

export default function itemsCounter(data) {
    const currentSite = Number(Object.fromEntries(data.url.searchParams.entries())[siteParamName]);

    const firstRowIdx = (currentSite - 1) * data.rowsOnSite + 1;
    const lastRowIdx = currentSite * data.rowsOnSite > data.totalRecordsNumber
        ? data.totalRecordsNumber
        : currentSite * data.rowsOnSite;

    return `${firstRowIdx}-${lastRowIdx} of ${data.totalRecordsNumber}`;
}
