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
const { ServicesEndpointsFormatter, ServicesDataCommons: { PERIOD_NAME_REGEX } } = require('./helpers');
const { findOrCreatePeriod } = require('../services/periods/findOrUpdateOrCreatePeriod.js');

const { databaseManager: {
    repositories: {
        RunRepository,
    },
} } = require('../database/DatabaseManager.js');
const { extractPeriod } = require('./helpers/ServicesDataCommons.js');

class MonalisaServiceDetails extends AbstractServiceSynchronizer {
    constructor() {
        super();
        this.batchSize = 5;

        this.ketpFields = {
            run_no: 'runNumber',
            raw_partition: 'periodName',
        };
    }

    async sync({ parentDataUnit: dataPass }) {
        const url = ServicesEndpointsFormatter.dataPassesDetailed(dataPass.description);
        this.metaStore.perUrl[url] = { parentDataUnit: dataPass };
        return await this.syncPerEndpoint(url);
    }

    processRawResponse(rawResponse) {
        return Object.entries(rawResponse).map(([id, dataPassDetailsAttributes]) => {
            dataPassDetailsAttributes['hid'] = id.trim();
            return dataPassDetailsAttributes;
        })
            .sort((a, b) => a.run_no - b.run_no)
            .map(this.adjustDataUnit.bind(this));
    }

    adjustDataUnit(dataPassDetails) {
        dataPassDetails = Utils.filterObject(dataPassDetails, this.ketpFields);
        const { periodName } = dataPassDetails;
        dataPassDetails.period = PERIOD_NAME_REGEX.test(periodName) ? extractPeriod(periodName) : undefined;
        return dataPassDetails;
    }

    isDataUnitValid() {
        return true;
    }

    async executeDbAction(dataPassDetails, forUrlMetaStore) {
        const { parentDataUnit: dbDataPass } = forUrlMetaStore;

        const getPotentialPeriod = async () => {
            if (dataPassDetails.period) {
                return await findOrCreatePeriod(dataPassDetails.period);
            } else {
                this.logger.warn(`Incorrect period name from monalisa ${dataPassDetails.periodName} 
                    for run ${dataPassDetails.runNumber} in detials of data pass ${dbDataPass.name}`);
                return [undefined, undefined];
            }
        };

        const findOrCreateRun = async ([dbPeriod, _]) => {
            dataPassDetails.PeriodId = dbPeriod?.id;
            return await RunRepository.findOrCreate({
                where: {
                    runNumber: dataPassDetails.runNumber,
                },
                defualt: {
                    runNumber: dataPassDetails.runNumber,
                    PeriodId: dataPassDetails.PeriodId,
                },
            })
                .catch(async (e) => {
                    throw new Error('Find or create run failed', {
                        cause: {
                            error: {
                                error: e.message,
                                cause: e.cause,
                            },
                            meta: {
                                actualValueInDB: await RunRepository.findOne(
                                    { where: { runNumber: dataPassDetails.runNumber } },
                                    { raw: true },
                                ).catch((error) => `ERROR RETRIVING ADDITIONAL INFO FROM DB: ${error.message}`),

                                inQueryValues: {
                                    runNumber: dataPassDetails.runNumber,
                                    PeriodId: dataPassDetails.PeriodId,
                                },
                                sourceValues: {
                                    runNumber: dataPassDetails.runNumber,
                                    periodName: dataPassDetails.period,
                                },
                            },
                        },
                    });
                });
        };

        const addRunToDataPass = async ([dbRun, _]) => await dbRun.addDataPasses(dbDataPass.id, { ignoreDuplicates: true });

        const pipeline = async () => await getPotentialPeriod()
            .then(findOrCreateRun)
            .then(addRunToDataPass);

        return await pipeline();
    }
}

module.exports = MonalisaServiceDetails;
