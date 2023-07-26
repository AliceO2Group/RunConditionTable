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

const req = require('esm')(module)
const assert = require('assert');
const { extractPeriodName, getClosestDefinedEnergy } = req('../../../app/public/utils/dataProcessing/dataProcessingUtils');

module.exports = () => {
    describe('Extract period name', () => {
        const dataPassName = 'LHC18q_calo_cluster_pass3';
        const expectedPeriodName = 'LHC18q';
        
        it('should return correct value', () => {
            assert(extractPeriodName(dataPassName) === expectedPeriodName);
        });
    });

    describe('Get closest defined energy', () => {
        const definedEnergyValues = {
            "450": 450,
            "6800": 6800,
            "7000": 7000,
            "5360/2": 2680
        };
        it('should return the input energy if nothing is withing the acceptable margin', () => {
            const energy = 6900;
            const acceptableMargin = 10;
            assert(getClosestDefinedEnergy(energy, definedEnergyValues, acceptableMargin) === energy.toString());
        });

        it('should resolve edge cases', () => {
            const energy = 6900;
            const acceptableMargin = 100;
            const expectedOutcome = "6800";
            assert(getClosestDefinedEnergy(energy, definedEnergyValues, acceptableMargin) === expectedOutcome);
        });

        it('should return the key energy', () => {
            const energy = 2680;
            const acceptableMargin = 1;
            const expectedOutcome = "5360/2";
            assert(getClosestDefinedEnergy(energy, definedEnergyValues, acceptableMargin) === expectedOutcome);
        });
    });
};
