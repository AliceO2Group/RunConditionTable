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
const itemsCounter = req('../../../app/public/components/table/itemsCounter').default;
const { assert } = require('chai');

module.exports = () => {
    describe('Items counter', () => {
        const mockPaginationModel = {
            currentPage: 5,
            itemsPerPage: 10,
            itemsCount: 57,
        }
        const expectedResult = '41-50 of 57';

        it('should not return null', () => {
            assert.isNotNull(itemsCounter(mockPaginationModel));
        });

        it('should count the items as expected', () => {
            assert.equal(itemsCounter(mockPaginationModel), expectedResult);
        });
    });
};
