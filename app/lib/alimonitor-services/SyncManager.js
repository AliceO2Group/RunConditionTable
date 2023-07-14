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
const { Log } = require('@aliceo2/web-ui');
const { databaseService } = require('../database');
const config = require('../../config');

const monalisaService = require('./MonalisaService');
const monalisaServiceMC = require('./MonalisaServiceMC');
const bookkeepingService = require('./BookkeepingService');

const { monalisaServiceDetails } = monalisaService;
const { monalisaServiceMCDetails } = monalisaServiceMC;

const services = {
    bookkeepingService,
    monalisaService,
    monalisaServiceDetails,
    monalisaServiceMC,
    monalisaServiceMCDetails,
};

class SyncManager {
    constructor() {
        this.logger = new Log(SyncManager.name);
        this.services = services;
        this.databaseService = databaseService;
    }

    async syncAll() {
        await this.services.bookkeepingService.setSyncTask();
        await this.services.monalisaService.setSyncTask();
        await this.services.monalisaServiceMC.setSyncTask();
    }

    async setSyncAllTask() {
        const syncPeriod = 12 * 60 * 60 * 1000; // Twice per day [ms]
        const last_sync = this.getLastSyncMetadata();
        const firstSyncDelay = last_sync.val === 'ok' ?
            syncPeriod - (Date.now() - (last_sync.updatedAt || 0) * 1000)
            : 1000;// Gives server 1 sec before sync task starts;

        setTimeout(() => {
            this.syncAll();
        }, firstSyncDelay);

        setTimeout(() => {
            this.syncAllTask = setInterval(this.syncAll.bind(this), syncPeriod);
        }, firstSyncDelay);
    }

    async getLastSyncMetadata() {
        return (await this.databaseService
            .pgExec(config.rctData.healthcheckQueries.meta.readLastSync.query))
            .rows[0];
    }

    async clearSyncAllTask() {
        clearInterval(this.syncAllTask);
    }
}

module.exports = new SyncManager();
