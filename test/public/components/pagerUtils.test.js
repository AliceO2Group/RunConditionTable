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

const { buttonClasses, pageButtonStyle, pagerButtonConditions } = req('../../../app/public/components/table/pagerUtils');
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

    describe('Page buttons', () => {
        it('should not display go back buttons when the user is on the first page', () => {
            assert(!pagerButtonConditions(1, 6).goToFirstPage &&
                !pagerButtonConditions(1, 4).goMiddleBack &&
                !pagerButtonConditions(1, 3).goOnePageBack);
        });

        it('should not display any pagination buttons when there is only one page', () => {
            const buttons = pagerButtonConditions(1, 1);
            assert(!Object.keys(buttons).reduce((acc, curr) => acc || buttons[curr], false));
        });

        it('should not display go forward buttons when the user is on the last page', () => {
            assert(!pagerButtonConditions(6, 6).goToLastPage &&
                !pagerButtonConditions(4, 4).goMiddleForward &&
                !pagerButtonConditions(3, 3).goOnePageForward);
        });
    });
};
