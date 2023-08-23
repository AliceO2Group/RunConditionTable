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

const { databaseManager: {
    repositories: {
        RunRepository,
        PeriodRepository,
    },
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

    async sync(dataPass) {
        return await this.syncPerEndpoint(
            EndpointsFormatter.dataPassesDetailed(dataPass.description),
            (raw) => this.responsePreprocess(raw),
            (v) => Utils.filterObject(v, this.ketpFields),
            () => true,
            async (dbClient, v) => {
                v.parentDataUnit = dataPass;

                return await PeriodRepository.T.findOrCreate({
                    where: {
                        name: v.period,
                    },
                })
                    .then(async ([period, _]) => await RunRepository.T.findOrCreate({
                        where: {
                            runNumber: v.runNumber,
                            PeriodId: period.id,
                        },
                    }))
                    .then(async ([run, _]) => await run.addDataPasses(dataPass.id));
            },
        );
    }

    responsePreprocess(d) {
        const entries = Object.entries(d);
        const res = entries.map(([hid, vObj]) => {
            vObj['hid'] = hid.trim();
            return vObj;
        });
        return res;
    }
}

module.exports = MonalisaServiceDetails;
