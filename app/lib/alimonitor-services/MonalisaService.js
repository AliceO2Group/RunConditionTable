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
const { ServicesEndpointsFormatter,
    ServicesDataCommons: {
        mapBeamTypeToCommonFormat,
        extractPeriod,
        PERIOD_NAME_REGEX,
    },
} = require('./helpers');
const MonalisaServiceDetails = require('./MonalisaServiceDetails.js');
const config = require('../config/configProvider.js');

const { databaseManager: {
    repositories: {
        DataPassRepository,
    },
    sequelize,
} } = require('../database/DatabaseManager.js');
const { findOrCreatePeriod } = require('../services/periods/findOrUpsertOrCreatePeriod.js');

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
        const lastRunsRes = await sequelize.query(
            'SELECT name, last_run, max(run_number) as last_run_in_details \
            FROM data_passes AS dp \
            LEFT JOIN data_passes_runs AS dpr \
                ON dpr.data_pass_id = dp.id \
            GROUP BY name, last_run;',
        );
        this.lastRuns = Object.fromEntries(lastRunsRes[0].map((lastRunData) => {
            const { name, last_run: lastRun, last_run_in_details: lastRunInDetails } = lastRunData;
            return [name, { lastRun, lastRunInDetails }];
        }));

        return await this.syncPerEndpoint(
            ServicesEndpointsFormatter.dataPassesRaw(),
        );
    }

    isDataUnitValid(dataPass) {
        const { lastRun, lastRunInDetails } = this.lastRuns[dataPass.name] ?? {};
        return dataPass.period.year >= config.dataFromYearIncluding &&
            (dataPass.lastRun !== lastRun || lastRun !== lastRunInDetails);
    }

    processRawResponse(res) {
        const entries = Object.entries(res);
        const preprocesed = entries.map(([prodName, vObj]) => {
            vObj['name'] = prodName.trim();
            return vObj;
        }).filter((r) => r.name?.match(PERIOD_NAME_REGEX.rightExtend('_.*$')));
        return preprocesed.map(this.adjustDataUnit.bind(this));
    }

    adjustDataUnit(dataPass) {
        dataPass = Utils.filterObject(dataPass, this.ketpFields);
        dataPass.outputSize = dataPass.outputSize ? Number(dataPass.outputSize) : null;
        dataPass.period = mapBeamTypeToCommonFormat(extractPeriod(dataPass.name, dataPass.beam_type));
        return dataPass;
    }

    async executeDbAction(dataPass) {
        const { period } = dataPass;
        const act = async () => findOrCreatePeriod(period)
            .then(async ([period, _]) => await DataPassRepository.upsert({
                PeriodId: period.id,
                ...dataPass,
            }))
            .then(async ([dbDataPass, _]) => await this.monalisaServiceDetails.setSyncTask({ parentDataUnit: dbDataPass }));

        return await sequelize.transaction(async (_t1) => await act());
    }
}

module.exports = new MonalisaService();
