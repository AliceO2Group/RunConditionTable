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
const { ServicesEndpointsFormatter, ServicesDataCommons: { extractPeriod, mapBeamTypeToCommonFormat } } = require('./helpers');

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
    }

    async sync() {
        await DetectorSubsystemRepository.findAll({ raw: true }).then((r) => {
            this.detectorsNameToId = r?.length > 0 ? r :
                Utils.throwWrapper(new Error('Incorrect setup of database, no detector subsystems data in it'));
            this.detectorsNameToId = Object.fromEntries(this.detectorsNameToId.map(({ id, name }) => [name, id]));
        }).catch(this.logger.error.bind(this.logger));

        const results = [];
        let state = {
            page: 0,
            limit: 100,
        };
        while (!this.syncTraversStop(state)) {
            const partialResult = await this.syncPerEndpoint(
                ServicesEndpointsFormatter.bookkeeping(state['page'], state['limit']),
                this.metaDataHandler.bind(this),
            );
            results.push(partialResult);
            this.logger.info(`progress of ${state['page']} to ${this.metaStore['pageCount']}`);
            state = this.nextState(state);
        }

        return results.flat().every((_) => _);
    }

    processRawResponse(rawResponse) {
        return rawResponse.data.map(this.adjustDataUnit.bind(this));
    }

    isDataUnitValid() {
        return true;
    }

    adjustDataUnit(run) {
        run = Utils.filterObject(run, this.ketpFields);
        const { detectors } = run;
        delete run.detectors;
        run.detectorNames = detectors.map(({ name }) => name.trim());
        run.detectorQualities = detectors.map(({ quality }) => quality);

        this.coilsCurrentsFieldsParsing(run, 'l3_current_val', 'l3_current_polarity', 'l3CurrentVal');
        this.coilsCurrentsFieldsParsing(run, 'dipole_current_val', 'dipole_current_polarity', 'dipoleCurrentVal');
        mapBeamTypeToCommonFormat(run);
        run.fillNumber = Number(run.fillNumber);
        return run;
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

    async executeDbAction(run) {
        const { periodName, detectorNames, detectorQualities, beamType } = run;
        delete run.periodName;
        delete run.detectorNames;
        delete run.detectorQualities;
        delete run.beamType;

        const period = extractPeriod(periodName, beamType);
        const { detectorsNameToId } = this;

        return await BeamTypeRepository.T.findOrCreate({
            where: {
                name: beamType,
            },
        })
            .then(async ([beamType, _]) => await PeriodRepository.T.findOrCreate({
                where: {
                    name: period.name,
                },
                default: {
                    name: period.name,
                    year: period.year,
                    BeamTypeId: beamType.id,
                },
            }))
            .catch((e) => {
                throw new Error('Find or create period failed', {
                    cause: {
                        error: e.message,
                        meta: {
                            explicitValues: {
                                name: period.name,
                                year: period.year,
                                BeamTypeId: beamType.id,
                            },
                            implicitValues: {
                                BeamType: beamType,
                            },
                        },
                    },
                });
            })
            .then(async ([period, _]) => await RunRepository.T.upsert({
                PeriodId: period.id,
                ...run,
            }))
            .then(async ([run, _]) => {
                const d = detectorNames?.map((detectorName, i) => ({
                    run_number: run.runNumber,
                    detector_id: detectorsNameToId[detectorName],
                    quality: detectorQualities[i] }));

                await RunDetectorsRepository.T.bulkCreate(
                    d, { updateOnDuplicate: ['quality'] },
                );
            });
    }

    /**
     * It is used for managing fetching runs data from Bkp due to limits for rows per request in Bkp
     * @param {*} rawResponse - raw response from Bookkeeping endpoint
     * @returns {void}
     */
    async metaDataHandler(rawResponse) {
        const { page } = rawResponse['meta'];
        if (!page || !page['pageCount']) {
            this.logger.error(`No metadata found in Bookkeeping for the requested page: ${JSON.stringify(rawResponse)}`);
            this.interrtuptSyncTask();
            return;
        }
        this.metaStore['pageCount'] = page['pageCount'];
        this.metaStore['totalCount'] = page['totalCount'];
    }

    syncTraversStop(currentState) {
        return this.isStopped() || currentState['page'] >= this.metaStore['pageCount'];
    }

    nextState(state) {
        state['page'] += 1;
        return state;
    }
}

module.exports = new BookkeepingService();
