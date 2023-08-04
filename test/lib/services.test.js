/**
 * @license
 * Copyright CERN and copyright holders of ALICE O2. This software is
 * distributed under the terms of the GNU General Public License v3 (GPL
 * Version 3), copied verbatim in the file "COPYING".
 *
 * See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */
const { dataPassService } = require('../../app/lib/services/dataPasses/DataPassService');
const { runService } = require('../../app/lib/services/runs/RunService');
const { periodService } = require('../../app/lib/services/periods/PeriodService');
const { simulationPassesService } = require('../../app/lib/services/simulationPasses/SimulationPassService');

const assert = require('assert');

module.exports = () => {
    describe('Services suite', () => {
        describe('PeriodService', () => {
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(periodService.getAll.bind(periodService, {}));
            });
        });
        describe('RunService', () => {
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(runService.getAll.bind(runService, {}));
            });
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(runService.getRunsPerDataPass.bind(runService, 0, {}));
            });
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(runService.getRunsPerPeriod.bind(runService, 0, {}));
            });
        });
        describe('DataPassService', () => {
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(dataPassService.getAll.bind(dataPassService, {}));
            });
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(dataPassService.getDataPassesPerPeriod.bind(dataPassService, 0, {}));
            });
        });
        describe('SimulationPassService', () => {
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(simulationPassesService.getAll.bind(simulationPassesService, {}));
            });
            // it('check whether methods do not throws', async () => {
            //     await assert.doesNotReject(simulationPassesService.getSimulationPassesPerPeriod.bind(simulationPassesService, 0, {}));
            // });
        });
    });
};
