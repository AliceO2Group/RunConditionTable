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

/**
 * BookkeepingService used to synchronize runs
 */
class BookkeepingService extends ServicesSynchronizer {
    constructor() {
        super();
        this.taskPeriodMilis = 4000;
        this.logger = new Log(BookkeepingService.name);
        this.endpoints = config.services.bookkeeping.url;
        this.ketpFields = {
            runNumber: 'run_number',
            timeO2Start: 'start',
            timeO2End: 'end',
            timeTrgStart: 'time_trg_start',
            timeTrgEnd: 'time_trg_end',
            runType: 'run_type',
            detectors: 'detectors',
        };
        this.syncTimestamp = 1 * 60 * 1000; // Milis
        this.oneRequestDelay = 100; // Milis
        this.tasks = [];

        this.forceStop = false;
    }

    dataAdjuster(run) {
        run = Utils.filterObject(run, this.ketpFields);
        run.period_id = 1; // TODO
        run.energy_per_beam = 0;
        run.id = 'DEFAULT';
        if (typeof run.detectors === 'string') {
            run.detectors = run.detectors.split(/ +/).map((d) => d.trim());
        }

        delete run.detectors; // TODO
        return run;
    }

    async syncer(dbClient, dataRow) {
        if (this.loglev > 2) {
            console.log(dataRow);
        }
        return await dbClient.query(Utils.simpleBuildInsertQuery('runs', dataRow));
    }

    metaDataHandler(requestJsonResult) {
        const { page } = requestJsonResult['meta'];
        this.metaStore['pageCount'] = page['pageCount'];
        this.metaStore['totalCount'] = page['totalCount'];
    }

    syncTraversStop(state) {
        if (this.forceStop || state['page'] > this.metaStore['pageCount']) {
            return true;
        }
        return false;
    }

    nextState(state) {
        state['page'] += 1;
        return state;
    }

    endpointBuilder(endpoint, state) {
        const e = `${endpoint}/?page[offset]=${state['page'] * state['limit']}&page[limit]=${state['limit']}`;
        return e;
    }

    async sync() {
        const pendingSyncs = [];
        let state = {
            page: 0,
            limit: 100,
        };
        while (!this.syncTraversStop(state)) {
            if (this.loglev) {
                this.logger.info(state);
                this.logger.info(this.metaStore);
            }
            const prom = this.syncData(
                this.endpointBuilder(this.endpoints.ali, state),
                this.dataAdjuster.bind(this),
                this.syncer.bind(this),
                (res) => res.data,
                this.metaDataHandler.bind(this),
            );
            pendingSyncs.push(prom);
            await prom;
            state = this.nextState(state);
            await Utils.delay(this.oneRequestDelay);
        }
        this.logger.info('bookkeeping sync trvers called ended');

        return Promise.all(pendingSyncs);
    }

    debugDisplaySync() {
        return this.syncData(
            this.endpoints.rct,
            this.dataAdjuster.bind(this),
            async (_, r) => this.logger.debug(JSON.stringify(r)),
            (res) => res.data,
        );
    }

    async setSyncTask() {
        this.forceStop = false;
        await this.sync();
    }

    setDebugTask() {
        const task = setInterval(this.debugDisplaySync.bind(this), this.syncTimestamp);
        this.tasks.push(task);
        return task;
    }

    clearTasks() {
        this.forceStop = true;
        for (const task of this.tasks) {
            clearInterval(task);
        }
    }

    async close() {
        this.clearTasks();
        await this.disconnect();
    }
}

module.exports = BookkeepingService;
