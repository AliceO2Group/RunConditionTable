/**
 *
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
const path = require('path');

const services = {
    bookkeeping: {
        url: {
            ali: ResProvider.getServiceEndpoint('BK_RUNS'),
        },
    },
    monalisa: {
        url: {
            dataPassesRaw: ResProvider.getServiceEndpoint('ML_DP_RAW'),
            dataPassesDetailed: ResProvider.getServiceEndpoint('ML_DP_DET'),

            mcRaw: ResProvider.getServiceEndpoint('ML_MC_RAW'),
            mcDetailed: ResProvider.getServiceEndpoint('ML_MC_DET'),
            mcDetTag: ResProvider.getServiceEndpoint('ML_MC_TAG'),
        },
    },

    batchSize: {
        ML: ResProvider.envOrDef('RCT_ML_BATCH_SIZE', 1),
    },

    rawJsonCachePath: process.env.RAW_JSON_CACHE_PATH ? path.resolve(process.env.RAW_JSON_CACHE_PATH) : path.join(
        __dirname,
        '..',
        '..',
        'database',
        'cache',
        'rawJson',
    ),
};

module.exports = services;
