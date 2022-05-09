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

const config = require('../config/configProvider.js');
const ServicesSynchronizer = require('./ServiceSynchronizer.js');
const Utils = require('../Utils.js');
const { Log } = require('@aliceo2/web-ui');

class MonalisaService extends ServicesSynchronizer {
    constructor() {
        super();
        this.logger = new Log(MonalisaService.name);
        this.endpoints = config.services.monalisa.url;
        this.ketpFields = undefined;
        this.tasks = [];
    }

    dataAdjuster(row) {
        row = Utils.filterObject(row, this.ketpFields);
        row.id = 'DEFAULT';
        return row;
    }

    // eslint-disable-next-line no-unused-vars
    async syncer(dbClient, dataRow) {
        throw new Error('not implemented');
        // eslint-disable-next-line no-unreachable
        return await dbClient.query(Utils.simpleBuildInsertQuery('runs', dataRow));
    }

    rawDataResponsePreprocess(d) {
        const entries = Object.entries(d);
        return entries.map(([prodName, vObj]) => {
            vObj['name'] = prodName;
            return vObj;
        });
    }

    syncRawMonalisaData() {
        return this.syncData(
            this.endpoints.rawData,
            this.dataAdjuster.bind(this),
            this.syncer.bind(this),
            this.rawDataResponsePreprocess,
        );
    }

    debugDisplaySync() {
        return this.syncData(
            this.endpoints.rawData,
            this.dataAdjuster.bind(this),
            async (_, r) => this.logger.debug(JSON.stringify(r)),
            this.rawDataResponsePreprocess,
        );
    }

    setSyncTask() {
        const task = setInterval(this.syncRawMonalisaData.bind(this), 1000);
        this.tasks.push(task);
        return task;
    }

    setDebugTask() {
        const task = setInterval(this.debugDisplaySync.bind(this), 1000);
        this.tasks.push(task);
        return task;
    }

    clearSyncTask() {
        for (const task of this.tasks) {
            clearInterval(task);
        }
    }

    async close() {
        this.clearSyncTask();
        await this.disconnect();
    }
}

module.exports = MonalisaService;
