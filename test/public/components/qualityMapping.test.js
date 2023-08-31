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

const { qualityMapping } = req('../../../app/public/components/detectors/qualityMapping');
const assert = require('assert');

module.exports = () => {
    describe('Page title', () => {
        const runBasedQualities = {
            good: 'good',
            bad: 'bad',
        };

        it('should return good for 0', () => {
            assert.equal(qualityMapping('0', runBasedQualities), runBasedQualities.good);
        });

        it('should return bad for 1', () => {
            assert.equal(qualityMapping('1', runBasedQualities), runBasedQualities.bad);
        });

        it('should return the same string for anything else', () => {
            assert.equal(qualityMapping('limited acceptance', runBasedQualities), 'limited acceptance');
        });
    });
};
