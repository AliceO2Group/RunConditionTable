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
const Utils = require('../Utils.js');
const EndpointsFormatter = require('./ServicesEndpointsFormatter.js');
const MonalisaServiceDetails = require('./MonalisaServiceDetails.js');
const config = require('../config/configProvider.js');

class MonalisaService extends AbstractServiceSynchronizer {
    constructor() {
        super();
        this.batchedRequestes = true;
        this.batchSize = 5;
        this.omitWhenCached = false;

        this.ketpFields = {
            name: 'name',
            reconstructed_events: 'number_of_events',
            description: 'description',
            output_size: 'size',
            interaction_type: 'beam_type',
        };

        this.monalisaServiceDetails = new MonalisaServiceDetails();
    }

    sync() {
        return this.syncPerEndpoint(
            EndpointsFormatter.dataPassesRaw(),
            this.responsePreprocess.bind(this),
            this.dataAdjuster.bind(this),
            (r) => r.period.year >= config.dataFromYearIncluding,
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
        dp.period = this.extractPeriod(dp);
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
            ${d.description}, 
            ${null},
            ${null},
            ${null},
            ${d.number_of_events},
            ${null},
            ${d.size}
        );`;
        return await Promise.all([dbClient.query(pgCommand), this.monalisaServiceDetails.sync(d)]);
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

module.exports = MonalisaService;
