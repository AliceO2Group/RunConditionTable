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
const ServicesDataCommons = require('./ServicesDataCommons.js');
const EndpintFormatter = require('./ServicesEndpointsFormatter.js');

/**
 * BookkeepingService used to synchronize runs
 */
class BookkeepingService extends AbstractServiceSynchronizer {
    constructor() {
        super();
        this.batchSize = 100;

        this.ketpFields = {
            id: 'ali-bk-id',
            runNumber: 'run_number',
            lhcPeriod: 'period',
            timeO2Start: 'time_start',
            timeO2End: 'time_end',
            timeTrgStart: 'time_trg_start',
            timeTrgEnd: 'time_trg_end',
            definition: 'run_type',
            lhcBeamEnergy: 'energy',
            detectors: 'detectors',
            aliceL3Current: 'l3_current_val',
            aliceL3Polarity: 'l3_current_polarity',
            aliceDipoleCurrent: 'dipole_current_val',
            aliceDipolePolarity: 'dipole_current_polarity',
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
                () => true,
                this.dbAction.bind(this),
                this.metaDataHandler.bind(this),
            );
            pendingSyncs.push(prom);
            await prom;
            this.logger.info(`progress of ${state['page']} to ${this.metaStore['pageCount']}`);
            state = this.nextState(state);
        }

        await Promise.all(pendingSyncs);
        this.logger.info('bookkeeping sync travers ended');
    }

    dataAdjuster(run) {
        try {
            run = Utils.filterObject(run, this.ketpFields);
            if (run.detectors) {
                if (typeof run.detectors === 'string') {
                    if (run.detectors.includes(',')) { // TODO may other delimiters
                        run.detectors = run.detectors.split(/,/).map((d) => d.trim().toUpperCase());
                    } else {
                        run.detectors = run.detectors.split(/ +/).map((d) => d.trim().toUpperCase());
                    }
                }
            } else {
                run.detectors = [];
            }
            this.coilsCurrentsFieldsParsing(run, 'l3_current_val', 'l3_current_polarity', 'l3_current');
            this.coilsCurrentsFieldsParsing(run, 'dipole_current_val', 'dipole_current_polarity', 'dipole_current');
            ServicesDataCommons.mapBeamTypeToCommonFormat(run);
            run.fill_number = Number(run.fill_number);
            return run;
        } catch (e) {
            this.logger.error(e);
            return null;
        }
    }

    coilsCurrentsFieldsParsing(run, valFN, polFN, tFN) {
        if (run[valFN] && run[polFN]) {
            if (run[polFN] == 'NEGATIVE') {
                run[tFN] = - Number(run[valFN]);
            } else if (run[polFN] == 'POSITIVE') {
                run[tFN] = run[valFN];
            } else {
                throw `incorrect polarity type: '${run[polFN]}' for run: ${run.run_number}`;
            }
        } else {
            run[tFN] = null;
        }
    }

    async dbAction(dbClient, d) {
        const { period } = d;
        const year = ServicesDataCommons.extractPeriodYear(period);
        d = Utils.adjusetObjValuesToSql(d);

        const period_insert = d.period ? `call insert_period(${d.period}, ${year}, ${d.beam_type});` : '';

        const detectorsInSql = `${d.detectors}::varchar[]`;
        const pgCommand = `${period_insert}; call insert_run (
            ${d.run_number},
            ${d.period}, 
            ${d.time_trg_start}, 
            ${d.time_trg_end}, 
            ${d.time_start}, 
            ${d.time_end}, 
            ${d.run_type},
            ${d.fill_number},
            ${d.energy}, 
            ${detectorsInSql},
            ${d.l3_current},
            ${d.dipole_current}
        );`;
        return await dbClient.query(pgCommand);
    }

    metaDataHandler(requestJsonResult) {
        const { page } = requestJsonResult['meta'];
        if (!page || !page['pageCount']) {
            this.logger.error(`No metadata found in Bookkeeping for the requested page: ${JSON.stringify(requestJsonResult)}`);
            this.forceStop = true;
        }
        this.metaStore['pageCount'] = page['pageCount'];
        this.metaStore['totalCount'] = page['totalCount'];
    }

    syncTraversStop(state) {
        return this.forceStop || state['page'] > this.metaStore['pageCount'];
    }

    nextState(state) {
        state['page'] += 1;
        return state;
    }
}

module.exports = new BookkeepingService();
