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
const { ServicesEndpointsFormatter, ServicesDataCommons: { extractPeriod } } = require('./helpers');

const config = require('../config/configProvider.js');

const { databaseManager: {
    repositories: {
        BeamTypeRepository,
        PeriodRepository,
        SimulationPassRepository,
        DataPassRepository,
        RunRepository,
    },
    sequelize,
} } = require('../database/DatabaseManager.js');

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
            .filter((simulationPass) => simulationPass.name?.match(/^LHC\d\d.*$/))
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
        simulationPass.anchoredPeriods = parseListLikeString(simulationPass.anchoredPeriods).map((periodName) => extractPeriod(periodName));
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
        const { beam_type } = simulationPass;

        return await SimulationPassRepository.T.upsert({
            name: simulationPass.name,
            PWG: simulationPass.pwg,
            jiraId: simulationPass.jiraId,
            description: simulationPass.description,
            requestedEvents: simulationPass.requestedEvents,
            outputSize: simulationPass.outputSize,
        })
            .then(async ([_simulationPass, _]) => {
                // Check periods;
                simulationPass.anchoredPeriods.map(async ({ name: periodName, year: periodYear }) =>
                    await PeriodRepository.T.findOrCreate({
                        where: {
                            name: periodName,
                        },
                        defaults: {
                            name: periodName,
                            year: periodYear,
                            BeamTypeId: !beam_type ? undefined : (await BeamTypeRepository.T.findOrCreate({
                                where: {
                                    name: simulationPass.beam_type,
                                },
                            }))[0]?.id,
                        },
                    })
                        .then(async ([period, _]) => {
                        // Add anchored period
                            const periodAddPromise = sequelize.transaction((_t) => _simulationPass.addPeriod(period.id,
                                { ignoreDuplicates: true }));

                            // Add anchored passes
                            const dataPassPipelinePromises = simulationPass.anchoredPasses
                                .map(async (passSuffix) => sequelize.transaction(
                                    async () => await DataPassRepository.findOrCreate({
                                        where: {
                                            name: `${period.name}_${passSuffix}`,
                                        },
                                        defaults: {
                                            name: `${period.name}_${passSuffix}`,
                                            PeriodId: period.id,
                                        },
                                    }).then(async ([dataPass, _]) => await _simulationPass.addDataPass(dataPass.id,
                                        { ignoreDuplicates: true })),
                                ));

                            // Add runs
                            const runsAddPipeline = simulationPass.runs.map(async (runNumber) => sequelize.transaction(async () => {
                                const run = await RunRepository.findOne({ where: { runNumber: runNumber } });
                                if (!run) {
                                    const insertWithoutPeriod = simulationPass.anchoredPeriods.length > 1;
                                    if (insertWithoutPeriod) {
                                        this.logger.warn(
                                            `Neither run {runNumber: ${runNumber}} is found, nor can infer its belonging to period,
                                             because multiple periods (${simulationPass.anchoredPeriods}) are 
                                             anchored to simulation pass ${simulationPass.name}`,
                                        );
                                    }

                                    await RunRepository.create({
                                        runNumber,
                                        PeriodId: insertWithoutPeriod ? undefined : period.id,
                                    });
                                }
                                return await _simulationPass.addRun(runNumber, { ignoreDuplicates: true });
                            }));

                            // Summary
                            return await Promise.all([periodAddPromise, dataPassPipelinePromises, runsAddPipeline].flat());
                        }));
            });
    }
}

module.exports = new MonalisaServiceMC();
