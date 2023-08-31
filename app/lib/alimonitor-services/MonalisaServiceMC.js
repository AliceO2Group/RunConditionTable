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
            this.responsePreprocess.bind(this),
            this.dataAdjuster.bind(this),
            (simulationPass) => {
                simulationPass.anchoredPeriods = simulationPass.anchoredPeriods
                    .filter((periodName) => {
                        try {
                            return extractPeriod(periodName).year >= config.dataFromYearIncluding;
                        } catch (error) {
                            this.logger.error(error);
                            return false;
                        }
                    });

                const { anchoredPeriods, anchoredPasses } = simulationPass;
                return anchoredPeriods.length != 0 && anchoredPasses.length != 0;
                // MC not anchored to any production or pass so drop out
            },
            this.executeDbAction.bind(this),
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
        sp.outputSize = Number(sp.outputSize);
        sp.requestedEvents = Number(sp.requestedEvents);

        const parseListLikeString = (rawString) => Utils
            .replaceAll(rawString, /,|'|;"/, ' ')
            .split(/ +/)
            .map((v) => v.trim())
            .filter((v) => v);

        /*
         * TODO Bug? anchored_periods/passes seems to be formated incorrectly,
         * there are extra commas at the begining of some samples
         */

        sp.anchoredPasses = parseListLikeString(sp.anchoredPasses);
        sp.anchoredPeriods = parseListLikeString(sp.anchoredPeriods);
        sp.runs = parseListLikeString(sp.runs).map((s) => Number(s));

        return sp;
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
                simulationPass.anchoredPeriods.map(async (periodName) => await PeriodRepository.T.findOrCreate({
                    where: {
                        name: periodName,
                    },
                    default: beam_type ? {
                        name: periodName,
                        BeamTypeId: await BeamTypeRepository.T.findOrCreate({
                            where: {
                                name: simulationPass.beam_type,
                            },
                        })[0]?.id,
                    } : undefined,
                })
                    .then(async ([period, _]) => {
                        // Add anchored period
                        const periodAddPromise = sequelize.transaction((_t) => _simulationPass.addPeriod(period.id));

                        // Add anchored passes
                        const dataPassPipelinePromises = simulationPass.anchoredPasses
                            .map(async (passSuffix) => await DataPassRepository.T.findOrCreate({
                                where: {
                                    name: `${period.name}_${passSuffix}`,
                                },
                                default: {
                                    name: `${period.name}_${passSuffix}`,
                                    PeriodId: period.id,
                                },
                            }).then(async ([dataPass, _]) => await sequelize.transaction((_t) => _simulationPass.addDataPass(dataPass.id))));

                        // Add runs
                        const runsAddPipeline = simulationPass.runs.map(async (runNumber) => {
                            const run = await RunRepository.T.findOne({ where: { runNumber: runNumber } });
                            if (!run) {
                                const insertWithoutPeriod = simulationPass.anchoredPeriods.length > 1;
                                if (insertWithoutPeriod) {
                                    this.logger.warn(
                                        `Neither run {runNumber: ${runNumber}} is found, nor can infer its belonging to period, because multiple 
                                        periods (${simulationPass.anchoredPeriods}) are anchored to simulation pass ${simulationPass.name}`,
                                    );
                                }

                                await RunRepository.T.findOrCreate({
                                    where: {
                                        runNumber,
                                    },
                                    default: {
                                        runNumber,
                                        PeriodId: insertWithoutPeriod ? undefined : period.id,
                                    },
                                });
                            }
                            return await sequelize.transaction((_t) => _simulationPass.addRun(runNumber, { ignoreDuplicates: true }));
                        });

                        // Summary
                        return await Promise.all([periodAddPromise, dataPassPipelinePromises, runsAddPipeline].flat());
                    }));
            });
    }
}

module.exports = new MonalisaServiceMC();
