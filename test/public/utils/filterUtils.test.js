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
const { filterField, filterType, filterSearch } = require('../../../app/public/utils/filtering/filterUtils');

module.exports = () => {
    const filterString='name-match=%LHC%';

    describe('Filter field', () => {
        it('should return correct value', () => {
            assert(filterField(filterString) === "name");
        });
    });

    describe('Filter type', () => {
        it('should return correct value', () => {
            assert(filterType(filterString) === "match");
        });
    });
};
