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
const Utils = require('../Utils.js');
const EndpointsFormatter = require('./ServicesEndpointsFormatter.js');

class MonalisaServiceMCDetails extends AbstractServiceSynchronizer {
    constructor() {
        super();

        this.batchedRequestes = true;
        this.batchSize = 5;

        this.keptFields = {
            run_no: 'run_number',
        };
    }

    async sync(d) {
        return await this.syncPerEndpoint(
            EndpointsFormatter.mcDetTag(Utils.replaceAll(d.name, "'", '')),
            (raw) => this.responsePreprocess(raw),
            (v) => Utils.filterObject(v, this.keptFields),
            () => true,
            async (dbClient, v) => {
                v = Utils.adjusetObjValuesToSql(v);
                const detailsSql = v ?
                    `call insert_mc_details(${d.name}, ${v.run_number});`
                    : '';
                return await dbClient.query(detailsSql);
            },
        );
    }

    responsePreprocess(d) {
        const entries = Object.entries(d);
        const aaa = entries.map(([hid, vObj]) => {
            vObj['hid'] = hid.trim();
            return vObj;
        });
        return aaa;
    }
}

module.exports = MonalisaServiceMCDetails;
