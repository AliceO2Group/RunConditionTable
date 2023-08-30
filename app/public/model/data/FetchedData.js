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

const defaultPageNumber = 1;

import { RCT } from '../../../config.js';
import { shouldDisplayDetectorField } from '../../utils/dataProcessing/dataProcessingUtils.js';
const DRF = RCT.dataResponseFields;

/**
 * Object of this class is used to hold data fetched from backend
 * set of data held in this structure are fully defined by the url given as on of constructor arguments
 * when some filtering parameters are or site, etc. is changed
 * the url is also changed in order to be consistent with data
 * @deprecated
 * Please use separate models for each view (e.g. periodsModel).
 */
export default class FetchedData {
    constructor(url, content, userPreferences, totalRecordsNumber = null) {
        this.url = url;
        this.itemsPerPage = userPreferences.itemsPerPage;
        this.detectorList = userPreferences.detectorList;

        this.sorting = {
            field: null,
            order: null, // 1 or -1
        };

        this.parseFetchedFields(content);
        this.parseFetchedRows(content);
        if (!totalRecordsNumber) {
            this.setInfoAboutTotalRecordsNumber(content);
        } else {
            this.totalRecordsNumber = totalRecordsNumber;
        }

        this.useUrlParams(url);
    }

    useUrlParams(url) {
        const params = Object.fromEntries(url.searchParams.entries());
        const DRP = RCT.dataReqParams;
        this.itemsPerPage = params['items-per-page'] ?? this.itemsPerPage;
        this.pageNumber = params[DRP.pageNumber] ? params[DRP.pageNumber] : defaultPageNumber;
        if (params['sorting']) {
            const { sorting } = params;
            if (sorting.startsWith('-')) {
                const field = sorting.slice(1);
                this.sorting = { field: field, order: -1 };
            } else {
                const field = sorting;
                this.sorting = { field: field, order: 1 };
            }
        }
    }

    parseFetchedFields(content) {
        this.fields = content.data.fields.map((field) => ({
            ...field,
            marked: shouldDisplayDetectorField(field.name, this.detectorList) || content.data.rows.some((r) => r[field.name]),
        }));
    }

    parseFetchedRows(content) {
        this.rows = content.data.rows.map((item) => {
            item.marked = false;
            return item;
        });
    }

    setInfoAboutTotalRecordsNumber(content) {
        if (! this.totalRecordsNumber) {
            this.totalRecordsNumber = content.data[DRF.totalRowsCount];
        }
    }

    sort() {
        if (this.sorting.field && this.sorting.order) {
            const f = this.sorting.field;
            const o = this.sorting.order;
            this.rows.sort((a, b) => a[f] > b[f] ? Number(o) : -1 * o);
        }
    }
}
