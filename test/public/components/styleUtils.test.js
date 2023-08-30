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

const { buttonClasses, pageButtonStyle } = req('../../../app/public/components/table/styleUtils');
const assert = require('assert');

module.exports = () => {
    describe('Page button style', () => {
        it('should return primary style when the target page is the current page', () => {
            assert.equal(pageButtonStyle(6, 6), buttonClasses.primary);
        });

        it('should return secondary style when the target page is the current page', () => {
            assert.equal(pageButtonStyle(3, 35), buttonClasses.secondary);
        });
    });
};
