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
const { databaseService } = require('../database/DatabaseService.js');
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
        try {
            await this.setInDBSyncInProgress();
            await this.services.bookkeepingService.setSyncTask();
            await this.services.monalisaService.setSyncTask();
            await this.services.monalisaServiceMC.setSyncTask();
            await this.setInDBSyncOk();
            this.logger.info('Synchronization completed');
        } catch {
            await this.setInDBSyncFailure();
        }
    }

    async setSyncAllTask() {
        const { syncPeriod } = config;
        const last_sync = await this.getLastSyncMetadata();
        const firstSyncDelay = last_sync?.val === 'ok' ?
            syncPeriod - (Date.now() - (last_sync?.updatedAt || 0) * 1000)
            : 3000;// Gives server 1 sec before sync task starts;
        const hours = Math.floor(firstSyncDelay / 60 / 60 / 1000);
        const minutes = Math.floor((firstSyncDelay - hours * 60 * 60 * 1000) / 60 / 1000);
        const seconds = Math.floor((firstSyncDelay - (hours * 60 + minutes) * 60 * 1000) / 1000);

        this.logger.info(`Next synchronization in ${hours} h ${minutes} min ${seconds} sec`);

        setTimeout(() => {
            this.syncAll();
        }, firstSyncDelay);

        setTimeout(() => {
            this.syncAllTask = setInterval(this.syncAll.bind(this), syncPeriod);
        }, firstSyncDelay);
    }

    async clearSyncAllTask() {
        clearInterval(this.syncAllTask);
    }

    async getLastSyncMetadata() {
        return (await this.databaseService
            .pgExec(config.rctData.healthcheckQueries.meta.readLastSync.query))
            .rows[0];
    }

    async setInDBSyncOk() {
        await this.databaseService
            .pgExec(config.rctData.healthcheckQueries.meta.setLastSyncOK.query);
    }

    async setInDBSyncFailure() {
        await this.databaseService
            .pgExec(config.rctData.healthcheckQueries.meta.setLastSyncFailed.query);
    }

    async setInDBSyncInProgress() {
        await this.databaseService
            .pgExec(config.rctData.healthcheckQueries.meta.setLastSyncInProgress.query);
    }
}

module.exports = {
    SyncManager,
    syncManager: new SyncManager(),
};
