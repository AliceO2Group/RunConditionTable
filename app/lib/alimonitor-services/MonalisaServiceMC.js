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

class MonalisaServiceMC extends ServicesSynchronizer {
    constructor() {
        super();
        this.logger = new Log(MonalisaServiceMC.name);
        this.ketpFields = {
            name: 'name',
            runList: 'runs',
            generator: 'description',
            jiraID: 'jira',
            PWG: 'pwg',
            requested_events: 'number_of_events',
            collision_system: 'beam_type',
            output_size: 'size',
            anchor_production: 'anchor_productions',
            anchor_pass: 'anchor_passes',
        };
        this.tasks = [];
    }

    /* eslint-disable */
    async mc() {
        try {
            let raw = require('../../tmp/mc.js');
            let preprocRaw = this.rawDataResponsePreprocess(raw);
            let adjRaw = preprocRaw.map(v => Utils.filterObject(v, this.ketpFields));
            console.log(adjRaw[0]);
            
            const mcDEP = EndpointsFormatter.mcDetTag(adjRaw[1].name);
            console.log(mcDEP);
            let det0 = await this.getRawResponse(mcDEP);
            console.log(this.detailedDataResponsePreproces(det0));
        } catch (e) {
            console.log(e)
        }
    }

    dataAdjuster(sp) {
        sp = Utils.filterObject(sp, this.ketpFields);
        sp.size = Number(sp.size);

        const anchor_passes = Utils
                    .replaceAll(sp.anchor_passes, /,|\'|;\"/, ' ')
                    .split(/ +/)
                    .map((v) => v.trim());
        const anchor_productions = Utils
                    .replaceAll(sp.anchor_productions, /,|\'|;\"/, ' ')
                    .split(/ +/)
                    .map((v) => v.trim());

        const period = Utils.adjusetObjValuesToSql(this.extractPeriod(sp));
        sp = Utils.adjusetObjValuesToSql(sp);
        sp.period = period;
        sp.anchor_passes = anchor_passes;
        sp.anchor_productions = anchor_productions;

        return sp;
    }

    async syncer(dbClient, d) {
        const { period } = d;
        const period_insert =
            d?.period?.name ? `call insert_period(${period.name}, ${period.year}, ${period.beam_type});` : '';

        const anchord_prod_sql = `ARRAY[${d.anchor_productions.map((d) => `'${d}'`).join(',')}]::varchar[]`;
        const anchord_passes_sql = `ARRAY[${d.anchor_passes.map((d) => `'${d}'`).join(',')}]::varchar[]`;


        let pgCommand = `${period_insert}; call insert_mc(
            ${d.name}, 
            ${d.description},
            ${d.pwg},
            ${anchord_prod_sql},
            ${anchord_passes_sql},
            ${d.jira},
            ${null},
            ${d.number_of_events},
            ${d.size}
        );`;

        // console.log(pgCommand);
        const detailsSql = await this.genSqlForDetailed(d);
        console.log(detailsSql)
        pgCommand = pgCommand + detailsSql;
        return await dbClient.query(pgCommand);
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
                        run_no: 'run_no',
                    };
                    const detO = detailed?.map((v) => Utils.adjusetObjValuesToSql(Utils.filterObject(v, kf)));
                    detailsSql = detO ? `${detO.map(
                        (v) => `call insert_mc_details(${d.name}, ${v.run_number}, ${v.period})`,
                    ).join(';')};` : '';
                }
            }
        } catch (e) {
            this.logger.error(e.stack);
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
        }).filter((r) => r.name?.match(/^LHC\d\d.*$/));
        return aaa;
    }

    syncRawMonalisaData() {
        return this.syncData(
            EndpointsFormatter.mcRaw(),
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
 
 module.exports = MonalisaServiceMC;
 