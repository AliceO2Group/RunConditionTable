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
const { extractPeriodName,
        getClosestDefinedEnergy,
        detectorName,
        isDetectorField,
        shouldDisplayDetectorField,
        rowDisplayStyle,
        capitalizeFirstLetter,
        getReadableFileSizeString,
        pageTitle } = req('../../../app/public/utils/dataProcessing/dataProcessingUtils');

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

    describe('Get detector name', () => {
        const detectorFieldName = 'cpv_detector';
        const nonDetectorFieldName = 'name';
        const expectedOutcome = 'CPV';
        
        it('should extract detector name from the field name', () => {
            assert(detectorName(detectorFieldName) === expectedOutcome);
        });

        it('should return null when provided field is not a detector field', () => {
            assert(detectorName(nonDetectorFieldName) === null);
        })
    });

    describe('Check if the field is detector field', () => {
        const detectorFieldName = 'cpv_detector';
        const nonDetectorFieldName = 'name';
        
        it('should recognize detector field', () => {
            assert(isDetectorField(detectorFieldName));
        });

        it('should recognize non-detector field', () => {
            assert(!isDetectorField(nonDetectorFieldName));
        })
    });

    describe('Check if detector field should be displayed', () => {
        const cpvFieldName = 'cpv_detector';
        const phsFieldName = 'phs_detector';
        const nonDetectorFieldName = 'name';
        const detectorList = {
            CPV: false,
            PHS: true,
        }
        
        it('should recognize non-displayable detector field', () => {
            assert(!shouldDisplayDetectorField(cpvFieldName, detectorList));
        });

        it('should recognize displayable detector field', () => {
            assert(shouldDisplayDetectorField(phsFieldName, detectorList));
        });

        it('should recognize non-detector field', () => {
            assert(!shouldDisplayDetectorField(nonDetectorFieldName, detectorList));
        });
    });

    describe('Check how the row should be displayed', () => {
        const displayNone = '.none';
        const rowSelected = '.row-selected';
        const rowNotSelected = '.row-not-selected';

        const selected = true;
        const notSelected = false;
        const shouldHideSelected = true;
        const shouldNotHideSelected = false;
        
        it('should not display hidden rows', () => {
            assert(rowDisplayStyle(selected, shouldHideSelected) === displayNone);
        });

        it('should apply selection class to selected rows', () => {
            assert(rowDisplayStyle(selected, shouldNotHideSelected) === rowSelected);
        });

        it('should apply corresponding class to unselected rows', () => {
            assert(rowDisplayStyle(notSelected, shouldNotHideSelected) === rowNotSelected);
        });

        it('should apply corresponding class to unselected rows', () => {
            assert(rowDisplayStyle(notSelected, shouldHideSelected) === rowNotSelected);
        });
    });

    describe('Check the readable file size', () => {
        const fileSizekB = 1024;
        const fileSizeGB = 3758096384;

        it('should parse kB correctly' , () => {
            assert(getReadableFileSizeString(fileSizekB) === '1.0 kB' );
        });

        it('should parse GB correctly' , () => {
            assert(getReadableFileSizeString(fileSizeGB) === '3.5 GB' );
        });
    });

    describe('Page title', () => {
        const pageNames = {
            periods: 'periods',
            dataPasses: 'dataPasses',
            mc: 'mc',
            anchoredPerMC: 'anchoredPerMC',
            anchoragePerDatapass: 'anchoragePerDatapass',
            runsPerPeriod: 'runsPerPeriod',
            runsPerDataPass: 'runsPerDataPass',
            flags: 'flags',
        };

        it('should return Periods page name' , () => {
            assert.equal(pageTitle(pageNames.periods, pageNames), 'Periods');
        });

        it('should return Data passes page name' , () => {
            assert.equal(pageTitle(pageNames.dataPasses, pageNames), 'Data passes per period');
        });

        it('should return Monte Carlo page name' , () => {
            assert.equal(pageTitle(pageNames.mc, pageNames), 'Monte Carlo');
        });

        it('should return Anchored per MC page name' , () => {
            assert.equal(pageTitle(pageNames.anchoredPerMC, pageNames), 'Anchored per MC');
        });

        it('should return Anchorage per data pass page name' , () => {
            assert.equal(pageTitle(pageNames.anchoragePerDatapass, pageNames), 'Anchorage per data pass');
        });

        it('should return Runs per period page name' , () => {
            assert.equal(pageTitle(pageNames.runsPerPeriod, pageNames), 'Runs per period');
        });

        it('should return Runs per data pass page name' , () => {
            assert.equal(pageTitle(pageNames.runsPerDataPass, pageNames), 'Runs per data pass');
        });

        it('should return Quality flags page name' , () => {
            assert.equal(pageTitle(pageNames.flags, pageNames), 'Quality flags');
        });
    });
};
