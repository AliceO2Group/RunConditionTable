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

const { databaseManager: {
    repositories: {
        BeamTypeRepository,
        PeriodRepository,
        SimulationPassRepository,
    },
    sequelize,
} } = require('../database/DatabaseManager.js');
const { extractPeriod } = require('./ServicesDataCommons.js');

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

        this.monalisaServiceMCDetails = new MonalisaServiceMCDetails();
    }

    sync() {
        return this.syncPerEndpoint(
            EndpointsFormatter.mcRaw(),
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

    async dbAction(dbClient, simulationPass) {
        const { beam_type } = simulationPass;
        console.log(simulationPass.anchoredPeriods)

        return await SimulationPassRepository.T.upsert({
            name: simulationPass.name,
            PWG: simulationPass.pwg,
            jiraId: simulationPass.jiraId,
            description: simulationPass.description,
            requestedEvents: simulationPass.requestedEvents,
            outputSize: simulationPass.outputSize,
        })
            .then(async ([_simulationPass, _]) => {
                // simulationPass.anchoredPeriods.map(async (periodName) => await PeriodRepository.T.findOrCreate({
                //     where: {
                //         name: periodName,
                //     },
                //     default: beam_type ? {
                //         name: periodName,
                //         BeamTypeId: await BeamTypeRepository.findOrCreate({
                //             name: simulationPass.beam_type,
                //         })[0]?.id,
                //     } : undefined,
                // }))
                // .forEach(async ([period, _]) => await sequelize.transaction((_t) => _simulationPass.addPeriod(period.id)));
            });

        /*
         * SimulationPass = Utils.adjusetObjValuesToSql(simulationPass);
         * const period_insert =
         *     simulationPass?.period?.name ? `call insert_period(${period.name}, ${period.year}, ${period.beam_type});` : '';
         */

        /*
         * Const anchord_prod_sql = `${simulationPass.anchoredPeriods}::varchar[]`;
         * const anchord_passes_sql = `${simulationPass.anchoredPasses}::varchar[]`;
         */

        /*
         * Const pgCommand = `${period_insert}; call insert_mc(
         *     ${simulationPass.name},
         *     ${simulationPass.description},
         *     ${simulationPass.pwg},
         *     ${anchord_prod_sql},
         *     ${anchord_passes_sql},
         *     ${simulationPass.jira},
         *     ${simulationPass.number_of_events},
         *     ${simulationPass.size}
         * ); call insert_mc_details(${simulationPass.name}, ${simulationPass.runs}::integer[], ${period.name});`;
         * return await dbClient.query(pgCommand);
         */
        // eslint-disable-next-line capitalized-comments
        // return await Promise.all([dbClient.query(pgCommand), this.monalisaServiceMCDetails.sync(d)]);
    }
}

module.exports = new MonalisaServiceMC();
