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
const { simulationPassService } = require('../../app/lib/services/simulationPasses/SimulationPassService');

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
                await assert.doesNotReject(runService.getRunsPerPeriod.bind(runService, 0, {}));
            });
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(runService.getRunsPerDataPass.bind(runService, 0, {}));
            });
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(runService.getRunsPerSimulationPass.bind(runService, 0, {}));
            });
        });

        describe('RunService xdxd', () => {
            [
                runService.getAll.bind(runService, {}),
                runService.getRunsPerPeriod.bind(runService, 0, {}),
                runService.getRunsPerDataPass.bind(runService, 0, {}),
                runService.getRunsPerSimulationPass.bind(runService, 0, {}),
            ]
                .map((boundMethod) =>
                    it(`Check if method <${boundMethod.name}> of RunService works correctly`,
                        async () => await assert.doesNotReject(boundMethod())));
        });
        describe('DataPassService', () => {
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(dataPassService.getAll.bind(dataPassService, {}));
            });
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(dataPassService.getDataPassesPerPeriod.bind(dataPassService, 0, {}));
            });
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(dataPassService.getAnchoredToSimulationPass.bind(dataPassService, 0, {}));
            });
        });
        describe('SimulationPassService', () => {
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(simulationPassService.getAll.bind(simulationPassService, {}));
            });
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(simulationPassService.getSimulationPassesPerPeriod.bind(simulationPassService, 0, {}));
            });
            it('check whether methods do not throws', async () => {
                await assert.doesNotReject(simulationPassService.getAnchorageForDataPass.bind(simulationPassService, 0, {}));
            });
        });
    });
};
