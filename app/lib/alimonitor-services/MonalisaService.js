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

const AbstractServiceSynchronizer = require('./AbstractServiceSynchronizer.js');
const Utils = require('../utils');
const ServicesDataCommons = require('./ServicesDataCommons.js');
const EndpointsFormatter = require('./ServicesEndpointsFormatter.js');
const MonalisaServiceDetails = require('./MonalisaServiceDetails.js');
const config = require('../config/configProvider.js');

class MonalisaService extends AbstractServiceSynchronizer {
    constructor() {
        super();
        this.batchSize = config.services.batchSize.ML;

        this.ketpFields = {
            name: 'name',
            reconstructed_events: 'number_of_events',
            description: 'description',
            output_size: 'size',
            interaction_type: 'beam_type',
            last_run: 'last_run',
        };

        this.monalisaServiceDetails = new MonalisaServiceDetails();
    }

    async sync() {
        await this.dbConnect();
        const last_runs_res = await this.dbClient.query('SELECT name, last_run from data_passes;');
        this.last_runs = Object.fromEntries(last_runs_res.rows.map((r) => Object.values(r)));
        await this.dbDisconnect();

        return await this.syncPerEndpoint(
            EndpointsFormatter.dataPassesRaw(),
            this.responsePreprocess.bind(this),
            this.dataAdjuster.bind(this),
            (r) => r.period.year >= config.dataFromYearIncluding && r.last_run != this.last_runs[r.name],
            this.dbAction.bind(this),
        );
    }

    responsePreprocess(res) {
        const entries = Object.entries(res);
        const preprocesed = entries.map(([prodName, vObj]) => {
            vObj['name'] = prodName.trim();
            return vObj;
        }).filter((r) => r.name?.match(/^LHC\d\d[a-zA-Z]_.*$/));
        return preprocesed;
    }

    dataAdjuster(dp) {
        dp = Utils.filterObject(dp, this.ketpFields);
        dp.size = Number(dp.size);
        dp.period = ServicesDataCommons.mapBeamTypeToCommonFormat(this.extractPeriod(dp));
        return dp;
    }

    async dbAction(dbClient, d) {
        const { description } = d;
        d = Utils.adjusetObjValuesToSql(d);
        d.rawDes = description;
        const { period } = d;
        const period_insert =
            d?.period?.name ? `call insert_period(${period.name}, ${period.year}, ${period.beam_type});` : '';
        const pgCommand = `${period_insert}; call insert_prod(
            ${d.name}, 
            ${d.period.name},
            ${d.description}, 
            ${null},
            ${null},
            ${d.number_of_events},
            ${null},
            ${d.size},
            ${d.last_run}
        );`;
        const q1 = await dbClient.query(pgCommand);
        const q2 = await this.monalisaServiceDetails.sync(d);
        return Promise.all([q1, q2]);
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
}

module.exports = new MonalisaService();
