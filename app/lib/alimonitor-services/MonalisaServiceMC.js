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
const { ServicesEndpointsFormatter, ServicesDataCommons: { extractPeriod, PERIOD_NAME_REGEX } } = require('./helpers');
const config = require('../config/configProvider.js');

const { databaseManager: {
    repositories: {
        SimulationPassRepository,
        DataPassRepository,
        RunRepository,
    },
    sequelize,
} } = require('../database/DatabaseManager.js');
const { findOrCreatePeriod } = require('../services/periods/findOrUpdateOrCreatePeriod.js');

class MonalisaServiceMC extends AbstractServiceSynchronizer {
    constructor() {
        super();

        this.batchSize = config.services.batchSize.ML;

        this.ketpFields = {
            name: 'name',
            runList: 'runs',
            generator: 'description',
            jiraID: 'jiraId',
            PWG: 'pwg',
            requested_events: 'requestedEvents',
            collision_system: 'beam_type',
            output_size: 'outputSize',
            anchor_production: 'anchoredPeriods',
            anchor_pass: 'anchoredPasses',
        };
    }

    sync() {
        return this.syncPerEndpoint(
            ServicesEndpointsFormatter.mcRaw(),
        );
    }

    processRawResponse(rawResponse) {
        return Object.entries(rawResponse).map(([simPassName, simPassAttributes]) => {
            simPassAttributes['name'] = simPassName.trim();
            return simPassAttributes;
        })
            .filter((simulationPass) => simulationPass.name?.match(PERIOD_NAME_REGEX.rightExtend('.*')))
            .map(this.adjustDataUnit.bind(this));
    }

    adjustDataUnit(simulationPass) {
        simulationPass = Utils.filterObject(simulationPass, this.ketpFields);
        simulationPass.outputSize = Number(simulationPass.outputSize);
        simulationPass.requestedEvents = Number(simulationPass.requestedEvents);

        const parseListLikeString = (rawString) => Utils
            .replaceAll(rawString, /,|'|;"/, ' ')
            .split(/ +/)
            .map((v) => v.trim())
            .filter((v) => v);

        /*
         * TODO Bug? anchored_periods/passes seems to be formated incorrectly,
         * there are extra commas at the begining of some samples
         */

        simulationPass.anchoredPasses = parseListLikeString(simulationPass.anchoredPasses);
        simulationPass.anchoredPeriods = parseListLikeString(simulationPass.anchoredPeriods)
            .filter((periodName) => PERIOD_NAME_REGEX.test(periodName))
            .map((periodName) => extractPeriod(periodName, simulationPass.beam_type));
        simulationPass.runs = parseListLikeString(simulationPass.runs).map((s) => Number(s));

        return simulationPass;
    }

    isDataUnitValid(simulationPass) {
        simulationPass.anchoredPeriods = simulationPass.anchoredPeriods
            .filter(({ year: periodYear }) => {
                try {
                    return periodYear >= config.dataFromYearIncluding;
                } catch (error) {
                    this.logger.error(error);
                    return false;
                }
            });

        const { anchoredPeriods, anchoredPasses } = simulationPass;
        return anchoredPeriods.length != 0 && anchoredPasses.length != 0;
        // MC not anchored to any production or pass so drop out
    }

    async executeDbAction(simulationPass) {
        return await SimulationPassRepository.upsert({
            name: simulationPass.name,
            PWG: simulationPass.pwg,
            jiraId: simulationPass.jiraId,
            description: simulationPass.description,
            requestedEvents: simulationPass.requestedEvents,
            outputSize: simulationPass.outputSize,
        })
            .then(async ([dbSimulationPass, _]) => {
                await Promise.all(simulationPass.anchoredPeriods.map(async (period) =>
                    findOrCreatePeriod(period)
                        .then(async ([period, _]) => {
                            const periodAddPromise = dbSimulationPass.addPeriod(period.id, { ignoreDuplicates: true });
                            const dataPassPipelinePromises = this.findOrCreateAndAddDataPasses(simulationPass, dbSimulationPass, period);
                            const runsAddPipeline = this.findOrCreateAndAddRuns(simulationPass, dbSimulationPass, period);

                            await Promise.all([periodAddPromise, dataPassPipelinePromises, runsAddPipeline]);
                        })));
            });
    }

    async findOrCreateAndAddDataPasses(simulationPass, dbSimulationPass, period) {
        const promises = simulationPass.anchoredPasses
            .map((passSuffix) => sequelize.transaction(
                () => DataPassRepository.findOrCreate({
                    where: {
                        name: `${period.name}_${passSuffix}`,
                    },
                    defaults: {
                        name: `${period.name}_${passSuffix}`,
                        PeriodId: period.id,
                    },
                }).then(([dataPass, _]) => dbSimulationPass.addDataPass(dataPass.id,
                    { ignoreDuplicates: true })),
            ));
        return await Promise.all(promises);
    }

    async findOrCreateAndAddRuns(simulationPass, dbSimulationPass, period) {
        const promises = simulationPass.runs.map((runNumber) => sequelize.transaction(async () => {
            const insertWithoutPeriod = simulationPass.anchoredPeriods.length > 1;
            await RunRepository.findOrCreate({
                where: {
                    runNumber,
                },
                defaults: {
                    runNumber,
                    PeriodId: insertWithoutPeriod ? undefined : period.id,
                },
            });

            return await dbSimulationPass.addRun(runNumber, { ignoreDuplicates: true });
        }));

        return await Promise.all(promises);
    }
}

module.exports = new MonalisaServiceMC();
