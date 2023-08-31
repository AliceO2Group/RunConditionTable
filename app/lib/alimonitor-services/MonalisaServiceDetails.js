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
const { ServicesEndpointsFormatter } = require('./helpers');

const { databaseManager: {
    repositories: {
        RunRepository,
        PeriodRepository,
    },
    sequelize,
} } = require('../database/DatabaseManager.js');

class MonalisaServiceDetails extends AbstractServiceSynchronizer {
    constructor() {
        super();
        this.batchSize = 5;

        this.ketpFields = {
            run_no: 'runNumber',
            raw_partition: 'period',
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
        return Utils.filterObject(dataPassDetails, this.ketpFields);
    }

    isDataUnitValid() {
        return true;
    }

    async executeDbAction(dataPassDetails, forUrlMetaStore) {
        const { parentDataUnit: dataPass } = forUrlMetaStore;
        return (async () => {
            if (/LHC[0-9]{2}[a-z]+/.test(dataPassDetails.period)) {
                return await PeriodRepository.T.findOrCreate({
                    where: {
                        name: dataPassDetails.period,
                    },
                });
            } else {
                // eslint-disable-next-line max-len
                this.logger.warn(`Incorrect period from monalisa ${dataPassDetails.period} for run ${dataPassDetails.runNumber} in data pass ${dataPass.name}`);
                return [undefined, undefined];
            }
        })()
            .then(async ([period, _]) => {
                dataPassDetails.PeriodId = period?.id;
                return await RunRepository.T.findOrCreate({
                    where: {
                        runNumber: dataPassDetails.runNumber,
                    },
                    defualt: {
                        runNumber: dataPassDetails.runNumber,
                        PeriodId: dataPassDetails.PeriodId,
                    },
                });
            })
            .catch(async (e) => {
                throw new Error('Find or create run failed', {
                    cause: {
                        error: e.message,
                        meta: {
                            actualValueInDB: await RunRepository.findOne({ where: { runNumber: dataPassDetails.runNumber } }, { raw: true }),
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
            })
            .then(async ([run, _]) => await sequelize.transaction(() => run.addDataPasses(dataPass.id, { ignoreDuplicates: true })));
    }
}

module.exports = MonalisaServiceDetails;
