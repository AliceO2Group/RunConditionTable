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

const { databaseManager: {
    repositories: {
        BeamTypeRepository,
        PeriodRepository,
        DataPassRepository,
    },
} } = require('../database/DatabaseManager.js');

class MonalisaService extends AbstractServiceSynchronizer {
    constructor() {
        super();
        this.batchSize = config.services.batchSize.ML;

        this.ketpFields = {
            name: 'name',
            reconstructed_events: 'reconstructedEvents',
            description: 'description',
            output_size: 'outputSize',
            interaction_type: 'beam_type',
            last_run: 'lastRun',
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

    async dbAction(dbClient, dataPass) {
        const { period } = dataPass;

        return await BeamTypeRepository.T.findOrCreate({
            where: {
                name: period.beamType,
            },
        }).then(async ([beamType, _]) => await PeriodRepository.T.findOrCreate({
            where: {
                name: period.name,
                year: period.year,
                BeamTypeId: beamType.id,
            },
        })).then(async ([period, _]) => await DataPassRepository.T.upsert({
            PeriodId: period.id,
            ...dataPass,
        }));

        // const { description } = dataPass;
        // dataPass = Utils.adjusetObjValuesToSql(dataPass);
        // dataPass.rawDes = description;
        // const { period } = dataPass;
        // const period_insert =
        //     dataPass?.period?.name ? `call insert_period(${period.name}, ${period.year}, ${period.beamType});` : '';
        // const pgCommand = `${period_insert}; call insert_prod(
        //     ${dataPass.name}, 
        //     ${dataPass.period.name},
        //     ${dataPass.description}, 
        //     ${dataPass.number_of_events},
        //     ${dataPass.size},
        //     ${dataPass.last_run}
        // );`;
        // const q1 = await dbClient.query(pgCommand);
        // const q2 = await this.monalisaServiceDetails.sync(dataPass);
        // return Promise.all([q1, q2]);
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
            period.beamType = rowData.beam_type;

            return period;
        } catch (e) {
            return null;
        }
    }
}

module.exports = new MonalisaService();
