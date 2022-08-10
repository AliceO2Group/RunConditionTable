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
// eslint-disable-next-line no-unused-vars
const Utils = require('../Utils.js');
const { Log } = require('@aliceo2/web-ui');
const EnpointsFormatter = require('./ServicesEndpointsFormatter.js');

class MonalisaService extends ServicesSynchronizer {
    constructor() {
        super();
        this.logger = new Log(MonalisaService.name);
        this.ketpFields = {
            name: 'name',
            reconstructed_events: 'number_of_events',
            description: 'description',
            output_size: 'size',
            interaction_type: 'beam_type',
        };
        this.tasks = [];
    }

    dataAdjuster(dp) {
        // eslint-disable-next-line capitalized-comments
        dp = Utils.filterObject(dp, this.ketpFields);
        dp.id = 'DEFAULT';
        dp.size = Number(dp.size);

        const period = Utils.adjusetObjValuesToSql(this.extractPeriod(dp));
        dp = Utils.adjusetObjValuesToSql(dp);
        dp.period = period;

        return dp;
    }

    async syncer(dbClient, d) {
        const { period } = d;
        const period_insert = d?.period?.name ? `call insert_period(${period.name}, ${period.year}, ${period.beam_type});` : '';

        const pgCommand = `${period_insert}; call insert_prod(
            ${d.name}, 
            ${d.description}, 
            ${null},
            ${null},
            ${null},
            ${d.number_of_events},
            ${null},
            ${d.size}
        );`;

        return await dbClient.query(pgCommand);
    }

    extractPeriod(rowData) {
        try {
            const productionPrefix = rowData.name.slice(0, 6);
            const period = {};
            period.name = productionPrefix;
            let year = parseInt(productionPrefix.slice(3, 5), 10);
            if (year > 50) {
                year += 1900;
            } else {
                year += 2000;
            }
            period.year = year;
            period.beam_type = rowData.beam_type;

            return period;
        } catch (e) {
            return null;
        }
    }

    rawDataResponsePreprocess(d) {
        const entries = Object.entries(d);
        const aaa = entries.map(([prodName, vObj]) => {
            vObj['name'] = prodName.trim();
            return vObj;
        }).filter((r) => r.name?.match(/^LHC\d\d[a-zA-Z]_.*$/));
        return aaa;
    }

    syncRawMonalisaData() {
        return this.syncData(
            EnpointsFormatter.dataPassesRaw(),
            this.dataAdjuster.bind(this),
            this.syncer.bind(this),
            this.rawDataResponsePreprocess.bind(this),
        );
    }

    debugDisplaySync() {
        return this.syncData(
            EnpointsFormatter.dataPassesRaw(),
            this.dataAdjuster.bind(this),
            async (_, r) => this.logger.debug(JSON.stringify(r)),
            this.rawDataResponsePreprocess,
        );
    }

    async setSyncTask() {
        await this.syncRawMonalisaData();
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
