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
// eslint-disable-next-line no-unused-vars
const Utils = require('../Utils.js');
const { Log } = require('@aliceo2/web-ui');

class MonalisaService extends ServicesSynchronizer {
    constructor() {
        super();
        this.logger = new Log(MonalisaService.name);
        this.endpoints = config.services.monalisa.url;
        this.ketpFields = {
            reconstructed_events: 'number_of_events',
            description: 'description',
        };
        this.tasks = [];
    }

    dataAdjuster(row) {
        // eslint-disable-next-line capitalized-comments
        // row = Utils.filterObject(row, this.ketpFields);
        row.id = 'DEFAULT';
        return row;
    }

    // eslint-disable-next-line no-unused-vars
    async syncer(dbClient, dataRow) {
        const p = this.extractPeriod(dataRow);

        const pgCommand = `call insert_prod(
            '${dataRow.name}', 
            '${dataRow.description}', 
            ${null},
            ${null},
            ${null},
            ${dataRow.reconstructed_events},
            ${null},
            ${null},
        
            '${p.name}',
            '${p.year}',
            '${p.beam_type}');`;
        // eslint-disable-next-line no-console
        console.log(pgCommand);
        // eslint-disable-next-line no-console
        return await dbClient.query(pgCommand).catch(console.log);
    }

    extractPeriod(rowData) {
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
        period.beam_type = rowData.interaction_type;

        return period;
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
            this.endpoints.rawData,
            this.dataAdjuster.bind(this),
            this.syncer.bind(this),
            this.rawDataResponsePreprocess.bind(this),
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
