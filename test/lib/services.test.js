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

const boundMethodCheck = (boundMethod) =>
    it(`Check if method <${boundMethod.name}> works correctly`,
        async () => await assert.doesNotReject(boundMethod()));

module.exports = () => {
    describe('Services suite', () => {
        describe('PeriodService', () => {
            [periodService.getAll.bind(periodService, {})]
                .map(boundMethodCheck);
        });
        describe('RunService', () => {
            [
                runService.getAll.bind(runService, {}),
                runService.getRunsPerPeriod.bind(runService, 0, {}),
                runService.getRunsPerDataPass.bind(runService, 0, {}),
                runService.getRunsPerSimulationPass.bind(runService, 0, {}),
            ]
                .map(boundMethodCheck);
        });
        describe('DataPassService', () => {
            [
                dataPassService.getAll.bind(dataPassService, {}),
                dataPassService.getDataPassesPerPeriod.bind(dataPassService, 0, {}),
                dataPassService.getAnchoredToSimulationPass.bind(dataPassService, 0, {}),
            ].map(boundMethodCheck);
        });
        describe('SimulationPassService', () => {
            [
                simulationPassService.getAll.bind(simulationPassService, {}),
                simulationPassService.getSimulationPassesPerPeriod.bind(simulationPassService, 0, {}),
                simulationPassService.getAnchorageForDataPass.bind(simulationPassService, 0, {}),
            ].map(boundMethodCheck);
        });
    });
};
