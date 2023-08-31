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
const { ServicesEndpointsFormatter, ServicesDataCommons: { mapBeamTypeToCommonFormat, extractPeriod } } = require('./helpers');
const MonalisaServiceDetails = require('./MonalisaServiceDetails.js');
const config = require('../config/configProvider.js');

const { databaseManager: {
    repositories: {
        BeamTypeRepository,
        PeriodRepository,
        DataPassRepository,
    },
    sequelize,
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
        const last_runs_res = await sequelize.query(
            'SELECT name, last_run, max(run_number) as last_run_in_details \
            FROM data_passes AS dp \
            LEFT JOIN data_passes_runs AS dpr \
                ON dpr.data_pass_id = dp.id \
            GROUP BY name, last_run;',
        );
        this.last_runs = Object.fromEntries(last_runs_res[0].map((r) => {
            const { name, last_run, last_run_in_details } = r;
            return [name, { last_run, last_run_in_details }];
        }));

        return await this.syncPerEndpoint(
            ServicesEndpointsFormatter.dataPassesRaw(),
        );
    }

    isDataUnitValid(dataPass) {
        const { last_run, last_run_in_details } = this.last_runs[dataPass.name] ?? {};
        return dataPass.period.year >= config.dataFromYearIncluding &&
            (dataPass.lastRun !== last_run || last_run !== last_run_in_details);
    }

    processRawResponse(res) {
        const entries = Object.entries(res);
        const preprocesed = entries.map(([prodName, vObj]) => {
            vObj['name'] = prodName.trim();
            return vObj;
        }).filter((r) => r.name?.match(/^LHC\d\d[a-zA-Z]_.*$/));
        return preprocesed;
    }

    adjustData(dp) {
        dp = Utils.filterObject(dp, this.ketpFields);
        dp.outputSize = dp.outputSize ? Number(dp.outputSize) : null;
        dp.period = mapBeamTypeToCommonFormat(extractPeriod(dp.name, dp.beam_type));
        return dp;
    }

    async executeDbAction(dataPass) {
        const { period } = dataPass;

        return await BeamTypeRepository.T.findOrCreate({
            where: {
                name: period.beamType,
            },
        })
            .then(async ([beamType, _]) => await PeriodRepository.T.findOrCreate({
                where: {
                    name: period.name,
                },
                default: {
                    name: period.name,
                    year: period.year,
                    BeamTypeId: beamType.id,
                },
            }))
            .catch((e) => {
                throw new Error('Find or create period failed', {
                    cause: {
                        error: e.message,
                        meta: {
                            explicitValues: {
                                name: period.name,
                                year: period.year,
                            },
                        },
                    },
                });
            })
            .then(async ([period, _]) => await DataPassRepository.T.upsert({
                PeriodId: period.id,
                ...dataPass,
            }))
            .then(async ([dataPass, _]) => await this.monalisaServiceDetails.setSyncTask({ parentDataUnit: dataPass }));
    }
}

module.exports = new MonalisaService();
