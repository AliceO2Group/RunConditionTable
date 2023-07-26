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

const { roles, detectors, pageNames, filterTypes, filterInputTypes, fieldNames, quality, mapping } = require('./rct-data');
const { bookkeeping } = require('./outerServices');

module.exports = { // Properties that will be provided to frontend in the public folder
    outerServices: { bookkeeping },
    filterTypes: filterTypes,
    filterInputTypes: filterInputTypes,

    roles,
    quality,
    mapping,
    endpoints: {
        login: '/login/',
        logout: '/logout/',
        rctData: '/RCT-Data/',
        insertData: '/Rct-Data/insert-data/',
        authControl: '/auth-control/',
        date: '/date/',
        sync: '/sync/',
    },
    methods: {
        login: 'post',
        logout: 'post',
        rctData: 'get',
        date: 'get',
        insertData: 'post',
        authControl: 'get',
    },

    dataReqParams: {
        countRecords: 'count-records',
        site: 'site',
        rowsOnSite: 'rows-on-site',
    },

    defaultDataReqParams: {
        site: 1,
        rowsOnSite: 50,
    },

    dataRespondFields: {
        totalRowsCount: 'totalRowsCount',
        rows: 'rows',
        fields: 'fields',
    },

    pageNames: pageNames,
    fieldNames: fieldNames,

    detectors: detectors,
    themes: {
        ehevi: 'ehevi',
        webui: 'webui',
    },
};
