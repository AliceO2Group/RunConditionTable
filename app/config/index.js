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
const { ResProvider } = require('../lib/utils');

module.exports = Object.freeze({
    // Web-Ui config
    http: ResProvider.http(),
    jwt: ResProvider.jwt(),
    openId: ResProvider.openid(),

    // App config
    winston: ResProvider.winston(),
    database: ResProvider.database(),
    syncTaskAtStart: ResProvider.envOrDef('RCT_SYNC_TASK_AT_START', false, Boolean),
    rctData: require('./rct-data'),
    public: require('./public.js'),

    // External services config
    services: require('./services.js'),
    // RCT data config
    dataFromYearIncluding: 2018,

    // Other config
    errorsLoggingDepths: {
        no: () => null,
        message: (logger, er) => logger.error(er.message),
        stack: (logger, er) => logger.error(er.stack),
        object: (logger, er) => logger.error(JSON.stringify(er, null, 2)),
    },
    defaultErrorsLogginDepth: ResProvider.envOrDef('RCT_ERR_DEPTH', 'object'),
});
