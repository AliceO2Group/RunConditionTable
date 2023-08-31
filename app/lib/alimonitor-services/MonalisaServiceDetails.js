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

    async sync({ dataUnit: dataPass }) {
        return await this.syncPerEndpoint(
            ServicesEndpointsFormatter.dataPassesDetailed(dataPass.description),
            (raw) => this.responsePreprocess(raw),
            (v) => Utils.filterObject(v, this.ketpFields),
            () => true,
            async (v) => {
                v.parentDataUnit = dataPass;

                return (async () => {
                    if (/LHC[0-9]{2}[a-z]+/.test(v.period)) {
                        return await PeriodRepository.T.findOrCreate({
                            where: {
                                name: v.period,
                            },
                        });
                    } else {
                        this.logger.warn(`Incorrect period from monalisa ${v.period} for run ${v.runNumber} in data pass ${dataPass.name}`);
                        return [undefined, undefined];
                    }
                })()
                    .then(async ([period, _]) => {
                        v.PeriodId = period?.id;
                        return await RunRepository.T.findOrCreate({
                            where: {
                                runNumber: v.runNumber,
                            },
                            defualt: {
                                runNumber: v.runNumber,
                                PeriodId: v.PeriodId,
                            },
                        });
                    })
                    .catch(async (e) => {
                        throw new Error('Find or create run failed', {
                            cause: {
                                error: e.message,
                                meta: {
                                    actualValueInDB: await RunRepository.findOne({ where: { runNumber: v.runNumber } }, { raw: true }),
                                    inQueryValues: {
                                        runNumber: v.runNumber,
                                        PeriodId: v.PeriodId,
                                    },
                                    sourceValues: {
                                        runNumber: v.runNumber,
                                        periodName: v.period,
                                    },
                                },
                            },
                        });
                    })
                    .then(async ([run, _]) => await sequelize.transaction(() => run.addDataPasses(dataPass.id, { ignoreDuplicates: true })));
            },
        );
    }

    responsePreprocess(d) {
        const entries = Object.entries(d);
        const res = entries.map(([hid, vObj]) => {
            vObj['hid'] = hid.trim();
            return vObj;
        }).sort((a, b) => a.run_no - b.run_no);
        return res;
    }
}

module.exports = MonalisaServiceDetails;
