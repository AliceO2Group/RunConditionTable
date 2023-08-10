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

const defaultSite = 1;

import { RCT } from '../../../config.js';
const DRF = RCT.dataResponseFields;

/**
 * Object of this class is used to hold data fetched from backend
 * set of data held in this structure are fully defined by the url given as on of constructor arguments
 * when some filtering parameters are or site, etc. is changed
 * the url is also changed in order to be consistent with data
 *
 */

export default class FetchedData {
    constructor(url, content, rowsOnSite, totalRecordsNumber = null) {
        this.url = url;
        this.rowsOnSite = rowsOnSite;

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
        this.rowsOnSite = params['rows-on-site'] ? params['rows-on-site'] : this.rowsOnSite;
        this.site = params[DRP.site] ? params[DRP.site] : defaultSite;
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
        const { length } = content.data.fields;
        this.fields = content.data.fields.map((item) => {
            item.marked =
                length < 5
                || content.data.rows.length == 0
                || content.data.rows.some((r) => r[item.name]); // TODO

            return item;
        });
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
