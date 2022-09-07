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
const EndpointsFormatter = require('./ServicesEndpointsFormatter.js');

class MonalisaService extends ServicesSynchronizer {
    constructor() {
        super();
        this.batchedRequestes = true;
        this.batchSize = 5;
        this.omitWhenCached = false;

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
        dp = Utils.filterObject(dp, this.ketpFields);
        dp.size = Number(dp.size);

        const period = Utils.adjusetObjValuesToSql(this.extractPeriod(dp));
        const rawDes = dp.description;
        dp = Utils.adjusetObjValuesToSql(dp);
        dp.period = period;
        dp.rawDes = rawDes;

        return dp;
    }

    async syncer(dbClient, d) {
        const { period } = d;
        const period_insert =
            d?.period?.name ? `call insert_period(${period.name}, ${period.year}, ${period.beam_type});` : '';

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

        return await Promise.all([dbClient.query(pgCommand), this.detailsSyncer(d)]);
    }

    async detailsSyncer(d) {
        const kf = {
            run_no: 'run_number',
            raw_partition: 'period',
        };
        return await this.syncData(
            EndpointsFormatter.dataPassesDetailed(d.rawDes),
            (v) => Utils.adjusetObjValuesToSql(Utils.filterObject(v, kf)),
            async (dbClient, v) => {
                const detailsSql = v ?
                    `call insert_prod_details(${d.name}, ${v.run_number}, ${v.period});`
                    : '';
                return await dbClient.query(detailsSql);
            },
            (raw) => this.detailedDataResponsePreproces(raw),
        );
    }

    async genSqlForDetailed(d) {
        let detailsSql = '';
        try {
            const endpoint = EndpointsFormatter.dataPassesDetailed(d.rawDes);
            const rawDet = await this.getRawResponse(endpoint);
            if (Object.keys(rawDet).length > 0) {
                const detailed = this.detailedDataResponsePreproces(rawDet);
                if (detailed) {
                    const kf = {
                        run_no: 'run_number',
                        raw_partition: 'period',
                    };
                    const detO = detailed?.map((v) => Utils.adjusetObjValuesToSql(Utils.filterObject(v, kf)));
                    detailsSql = detO ? `${detO.map(
                        (v) => `call insert_prod_details(${d.name}, ${v.run_number}, ${v.period})`,
                    ).join(';')};` : '';
                }
            }
        } catch (e) {
            this.logger.error(e.message);
        }
        return detailsSql;
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

    detailedDataResponsePreproces(d) {
        const entries = Object.entries(d);
        const aaa = entries.map(([hid, vObj]) => {
            vObj['hid'] = hid.trim();
            return vObj;
        });
        return aaa;
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
            EndpointsFormatter.dataPassesRaw(),
            this.dataAdjuster.bind(this),
            this.syncer.bind(this),
            this.rawDataResponsePreprocess.bind(this),
        );
    }

    async setSyncTask() {
        this.forceStop = false;
        await this.syncRawMonalisaData();
    }

    async close() {
        this.clearSyncTask();
        await this.disconnect();
    }
}

module.exports = MonalisaService;
