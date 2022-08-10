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

const ServicesSynchronizer = require('./ServiceSynchronizer.js');
const Utils = require('../Utils.js');
const { Log } = require('@aliceo2/web-ui');
const EndpintFormatter = require('./ServicesEndpointsFormatter.js');

/**
 * BookkeepingService used to synchronize runs
 */
class BookkeepingService extends ServicesSynchronizer {
    constructor() {
        super();
        this.taskPeriodMilis = 4000;
        this.logger = new Log(BookkeepingService.name);
        this.ketpFields = {
            id: 'ali-bk-id',
            runNumber: 'run_number',
            lhcPeriod: 'period',
            timeO2Start: 'start',
            timeO2End: 'end',
            timeTrgStart: 'time_trg_start',
            timeTrgEnd: 'time_trg_end',
            runType: 'run_type',
            lhcBeamEnergy: 'energy',
            detectors: 'detectors',
            aliceDipoleCurrent: 'TODO', // TODO
        };
        this.syncTimestamp = 1 * 60 * 1000; // Milis
        this.oneRequestDelay = 100; // Milis
        this.tasks = [];

        this.forceStop = false;
    }

    dataAdjuster(run) {
        run = Utils.filterObject(run, this.ketpFields);
        run.id = 'DEFAULT';
        if (run.detectors) {
            if (typeof run.detectors === 'string') {
                if (run.detectors.includes(',')) { // TODO may ther delimiters
                    run.detectors = run.detectors.split(/,/).map((d) => d.trim());
                } else {
                    run.detectors = run.detectors.split(/ +/).map((d) => d.trim());
                }
            }
        } else {
            run.detectors = [];
        }

        return Utils.adjusetObjValuesToSql(run);
    }

    async syncer(dbClient, d) {
        if (this.loglev > 2) {
            // eslint-disable-next-line no-console
            console.log(d);
        }

        const detectorsInSql = `ARRAY[${d.detectors.map((d) => `'${d}'`).join(',')}]::varchar[]`;
        const pgCommand = `call insert_run (
            ${d.run_number},
            ${d.period}, 
            ${d.time_trg_start}, 
            ${d.time_trg_end}, 
            ${d.start}, 
            ${d.end}, 
            ${d.run_type}, 
            ${d.energy}, 
            ${detectorsInSql}
        );`;

        return await dbClient.query(pgCommand);
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

    endpointBuilder(state) {
        return EndpintFormatter.bookkeeping(state['page'], state['limit']);
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
                this.endpointBuilder(state),
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
