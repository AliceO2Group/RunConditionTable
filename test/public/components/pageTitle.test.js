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

const req = require('esm')(module);

const { pageTitle } = req('../../../app/public/components/common/pageTitle');
const assert = require('assert');

module.exports = () => {
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

        it('should return Periods page name', () => {
            assert.equal(pageTitle(pageNames.periods, pageNames), 'Periods');
        });

        it('should return Data passes page name', () => {
            assert.equal(pageTitle(pageNames.dataPasses, pageNames), 'Data passes per period');
        });

        it('should return Monte Carlo page name', () => {
            assert.equal(pageTitle(pageNames.mc, pageNames), 'Monte Carlo');
        });

        it('should return Anchored per MC page name', () => {
            assert.equal(pageTitle(pageNames.anchoredPerMC, pageNames), 'Anchored per MC');
        });

        it('should return Anchorage per data pass page name', () => {
            assert.equal(pageTitle(pageNames.anchoragePerDatapass, pageNames), 'Anchorage per data pass');
        });

        it('should return Runs per period page name', () => {
            assert.equal(pageTitle(pageNames.runsPerPeriod, pageNames), 'Runs per period');
        });

        it('should return Runs per data pass page name', () => {
            assert.equal(pageTitle(pageNames.runsPerDataPass, pageNames), 'Runs per data pass');
        });

        it('should return Quality flags page name', () => {
            assert.equal(pageTitle(pageNames.flags, pageNames), 'Quality flags');
        });
    });
};
