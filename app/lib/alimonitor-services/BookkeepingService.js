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
const { databaseManager: {
    repositories: {
        RunRepository,
        DetectorSubsystemRepository,
        PeriodRepository,
        BeamTypeRepository,
        RunDetectorsRepository,
    },
} } = require('../database/DatabaseManager.js');

/**
 * BookkeepingService used to synchronize runs
 */
class BookkeepingService extends AbstractServiceSynchronizer {
    constructor() {
        super();
        this.batchSize = 100;

        this.ketpFields = {
            runNumber: true,
            lhcPeriod: 'periodName',
            timeO2Start: true,
            timeO2End: true,
            timeTrgStart: true,
            timeTrgEnd: true,
            definition: 'runType',
            lhcBeamEnergy: true,
            detectorsQualities: 'detectors',
            aliceL3Current: 'l3_current_val',
            aliceL3Polarity: 'l3_current_polarity',
            aliceDipoleCurrent: 'dipole_current_val',
            aliceDipolePolarity: 'dipole_current_polarity',
            fillNumber: true,
            pdpBeamType: 'beamType',
        };

        DetectorSubsystemRepository.findAll({ raw: true }).then((r) => {
            this.detectorsNameToId = r?.length > 0 ? r :
                Utils.throwWrapper(new Error('Incorrect setup of database, no detector subsystems data in it'));
            this.detectorsNameToId = Object.fromEntries(this.detectorsNameToId.map(({ id, name }) => [name, id]));
        }).catch(this.logger.error);
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
    }

    dataAdjuster(run) {
        try {
            run = Utils.filterObject(run, this.ketpFields);
            const { detectors } = run;
            delete run.detectors;
            run.detectorNames = detectors.map(({ name }) => name.trim());
            run.detectorQualities = detectors.map(({ quality }) => quality);

            this.coilsCurrentsFieldsParsing(run, 'l3_current_val', 'l3_current_polarity', 'l3CurrentVal');
            this.coilsCurrentsFieldsParsing(run, 'dipole_current_val', 'dipole_current_polarity', 'dipoleCurrentVal');
            ServicesDataCommons.mapBeamTypeToCommonFormat(run);
            run.fillNumber = Number(run.fillNumber);
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
                throw `incorrect polarity type: '${run[polFN]}' for run: ${run.runNumber}`;
            }
        } else {
            run[tFN] = null;
        }
        delete run[valFN];
        delete run[polFN];
    }

    async dbAction(dbClient, run) {
        const { periodName, detectorNames, detectorQualities, beamType } = run;
        delete run.periodName;
        delete run.detectorNames;
        delete run.detectorQualities;
        delete run.beamType;

        const year = ServicesDataCommons.extractPeriodYear(periodName);
        const { detectorsNameToId } = this;

        return await BeamTypeRepository.findOrCreate({
            where: {
                name: beamType,
            },
        }).then(async ([beamType, _]) => await PeriodRepository.findOrCreate({
            where: {
                name: periodName,
                year,
                BeamTypeId: beamType.id,
            },
        })).then(async ([period, _]) => await RunRepository.findOrCreate({
            where: {
                runNumber: run.runNumber,
            },
            defaults: { PeriodId: period.id, ...run },
        }));

        // run = Utils.adjusetObjValuesToSql(run);
        // const period_insert = run.period ? `call insert_period(${run.period}, ${year}, ${run.beam_type});` : '';

        // const detectorInSql = `${run.detectorNames}::varchar[]`;
        // const detectorQualitiesInSql = `${run.detectorQualities}::varchar[]`;
        // const pgCommand = `${period_insert}; call insert_run (
        //     ${run.run_number},
        //     ${run.period}, 
        //     ${run.time_trg_start}, 
        //     ${run.time_trg_end}, 
        //     ${run.time_start}, 
        //     ${run.time_end}, 
        //     ${run.run_type},
        //     ${run.fill_number},
        //     ${run.energy}, 
        //     ${detectorInSql},
        //     ${detectorQualitiesInSql},
        //     ${run.l3_current},
        //     ${run.dipole_current}
        // );`;
        // return await dbClient.query(pgCommand);
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
