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

const RCT = window.RCT_CONF;

const { pageNumber } = RCT.dataReqParams;

/**
 * Please use the new items counter instead that uses the paginationModel
 * @deprecated
 * @param {*} data data
 * @returns {string} range of items diplayed on the given page and the total number of fetched records
 */
export default function obsoleteItemsCounter(data) {
    const currentPageNumber = Number(Object.fromEntries(data.url.searchParams.entries())[pageNumber]);

    const firstRowIdx = (currentPageNumber - 1) * data.itemsPerPage + 1;
    const lastRowIdx = currentPageNumber * data.itemsPerPage > data.totalRecordsNumber
        ? data.totalRecordsNumber
        : currentPageNumber * data.itemsPerPage;

    return `${firstRowIdx}-${lastRowIdx} of ${data.totalRecordsNumber}`;
}
