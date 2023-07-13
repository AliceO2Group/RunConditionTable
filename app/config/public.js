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

const { roles, flags: flagsTypes, detectors } = require('./rct-data');

module.exports = { // Properties that will be provided to frontend in the public folder
    filterTypes: {
        match: 'match',
        exclude: 'exclude',
        between: 'between',
    },

    roles,
    flagsTypes,
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

    pageNames: {
        periods: 'periods',
        dataPasses: 'dataPasses',
        mc: 'mc',
        anchoredPerMC: 'anchoredPerMC',
        anchoragePerDatapass: 'anchoragePerDatapass',
        runsPerPeriod: 'runsPerPeriod',
        runsPerDataPass: 'runsPerDataPass',
        flags: 'flags',
    },

    operationsNames: {
        flag_insert: 'flags_insert',
        flag_delete: 'flag_delete',
        flag_update: 'flag_update',
        verification_insert: 'verification_insert',
    },

    detectors: detectors,
    themes: {
        ehevi: 'ehevi',
        webui: 'webui',
    },
    flagReasonColors: {
        neutral: '277DA1',
        bad: '922C40',
        limitedAcceptance: 'DC9750',
    },
};
