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
const EndpointsFormatter = require('./ServicesEndpointsFormatter.js');
const MonalisaServiceMCDetails = require('./MonalisaServiceMCDetails.js');
const config = require('../config/configProvider.js');

class MonalisaServiceMC extends AbstractServiceSynchronizer {
    constructor() {
        super();

        this.batchSize = config.services.batchSize.ML;

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

        this.monalisaServiceMCDetails = new MonalisaServiceMCDetails();
    }

    sync() {
        return this.syncPerEndpoint(
            EndpointsFormatter.mcRaw(),
            this.responsePreprocess.bind(this),
            this.dataAdjuster.bind(this),
            (r) => {
                const { anchor_productions, anchor_passes } = r;
                return r.period.year >= config.dataFromYearIncluding && anchor_productions.length != 0 && anchor_passes.length != 0;
                // MC not anchored to any production so drop out
            },
            this.dbAction.bind(this),
        );
    }

    responsePreprocess(d) {
        const entries = Object.entries(d);
        const aaa = entries.map(([prodName, vObj]) => {
            vObj['name'] = prodName.trim();
            return vObj;
        }).filter((r) => r.name?.match(/^LHC\d\d.*$/));
        return aaa;
    }

    dataAdjuster(sp) {
        sp = Utils.filterObject(sp, this.ketpFields);
        sp.size = Number(sp.size);

        const parseListLikeString = (rawString) => Utils
            .replaceAll(rawString, /,|'|;"/, ' ')
            .split(/ +/)
            .map((v) => v.trim())
            .filter((v) => v);

        /*
         * TODO Bug? anchored_periods/passes seems to be formated incorrectly,
         * there are extra commas at the begining of some samples
         */

        sp.period = this.extractPeriod(sp);
        sp.anchor_passes = parseListLikeString(sp.anchor_passes);
        sp.anchor_productions = parseListLikeString(sp.anchor_productions);
        sp.runs = parseListLikeString(sp.runs).map((s) => Number(s));

        return sp;
    }

    async dbAction(dbClient, d) {
        const { anchor_productions, anchor_passes } = d;
        if (anchor_productions.length == 0 || anchor_passes.length == 0) {
            // MC not anchored to any production so drop out
            return;
        }
        d = Utils.adjusetObjValuesToSql(d);
        const { period } = d;
        const period_insert =
            d?.period?.name ? `call insert_period(${period.name}, ${period.year}, ${period.beam_type});` : '';

        const anchord_prod_sql = `${d.anchor_productions}::varchar[]`;
        const anchord_passes_sql = `${d.anchor_passes}::varchar[]`;

        const pgCommand = `${period_insert}; call insert_mc(
            ${d.name}, 
            ${d.description},
            ${d.pwg},
            ${anchord_prod_sql},
            ${anchord_passes_sql},
            ${d.jira},
            ${null},
            ${d.number_of_events},
            ${d.size}
        ); call insert_mc_details(${d.name}, ${d.runs}::integer[], ${period.name});`;
        return await dbClient.query(pgCommand);
        // eslint-disable-next-line capitalized-comments
        // return await Promise.all([dbClient.query(pgCommand), this.monalisaServiceMCDetails.sync(d)]);
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

module.exports = new MonalisaServiceMC();
