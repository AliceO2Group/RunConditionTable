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
const EndpintFormatter = require('./ServicesEndpointsFormatter.js');

/**
 * BookkeepingService used to synchronize runs
 */
class BookkeepingService extends AbstractServiceSynchronizer {
    constructor() {
        super();
        this.batchedRequestes = true;
        this.batchSize = 100;
        this.omitWhenCached = false;

        this.ketpFields = {
            id: 'ali-bk-id',
            runNumber: 'run_number',
            lhcPeriod: 'period',
            timeO2Start: 'start',
            timeO2End: 'end',
            timeTrgStart: 'time_trg_start',
            timeTrgEnd: 'time_trg_end',
            definition: 'run_type',
            lhcBeamEnergy: 'energy',
            detectors: 'detectors',
            aliceL3Current: 'b_field_val',
            aliceL3Polarity: 'b_field_polarity',
            fillNumber: 'fill_number',
            pdpBeamType: 'beam_type',
        };

        this.RUN_TYPE_PHYSICS = 'PHYSICS';
    }

    async sync() {
        const pendingSyncs = [];
        let state = {
            page: 0,
            limit: 100,
        };
        while (!this.syncTraversStop(state)) {
            const prom = this.syncPerEndpoint(
                EndpintFormatter.bookkeeping(state['page'], state['limit']),
                (res) => res.data,
                this.dataAdjuster.bind(this),
                this.dbAction.bind(this),
                this.metaDataHandler.bind(this),
            );
            pendingSyncs.push(prom);
            await prom;
            this.logger.info(`progress of ${state['page']} to ${this.metaStore['pageCount']}`);
            state = this.nextState(state);
        }

        await Promise.all(pendingSyncs);
        this.logger.info('bookkeeping sync trvers called ended');
    }

    dataAdjuster(run) {
        run = Utils.filterObject(run, this.ketpFields);
        if (run.detectors) {
            if (typeof run.detectors === 'string') {
                if (run.detectors.includes(',')) { // TODO may other delimiters
                    run.detectors = run.detectors.split(/,/).map((d) => d.trim());
                } else {
                    run.detectors = run.detectors.split(/ +/).map((d) => d.trim());
                }
            }
        } else {
            run.detectors = [];
        }
        if (run.b_field_val && run.b_field_polarity) {
            if (run.b_field_polarity == 'NEGATIVE') {
                run.b_field = - Number(run.b_field_val);
            } else if (run.b_field_polarity == 'POSITIVE') {
                run.b_field = run.b_field_val;
            } else {
                throw 'incorrect polarity type';
            }
        } else {
            run.b_field = null;
        }

        run.fill_number = Number(run.fillNumber);
        return run;
    }

    async dbAction(dbClient, d) {
        const { period } = d;
        const year = Utils.extractPeriodYear(period);
        d = Utils.adjusetObjValuesToSql(d);

        const period_insert = d.period ? `call insert_period(${d.period}, ${year}, ${d.beam_type});` : '';

        const detectorsInSql = `ARRAY[${d.detectors.map((d) => `'${d}'`).join(',')}]::varchar[]`;
        const pgCommand = `${period_insert} call insert_run (
            ${d.run_number},
            ${d.period}, 
            ${d.time_trg_start}, 
            ${d.time_trg_end}, 
            ${d.start}, 
            ${d.end}, 
            ${d.run_type},
            ${d.fill_number},
            ${d.b_field},
            ${d.energy}, 
            ${detectorsInSql}
        );`;

        return await dbClient.query(pgCommand);
    }

    metaDataHandler(requestJsonResult) {
        const { page } = requestJsonResult['meta'];
        this.metaStore['pageCount'] = page['pageCount'];
        this.metaStore['totalCount'] = page['totalCount'];
    }

    syncTraversStop(state) {
        if (this.forceStop || state['page'] > this.metaStore['pageCount']) {
            return true;
        }
        return false;
    }

    nextState(state) {
        state['page'] += 1;
        return state;
    }
}

module.exports = BookkeepingService;
