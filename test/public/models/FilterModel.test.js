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

const req = require('esm-wallaby')(module);
const assert = require('assert');

const FilterModel = req('../../../app/public/model/filtering/FilterModel.js').default;

module.exports = () => {
    describe('Class instance creation', () => {
        const fModel = new FilterModel();
        it('should instantiate the class with no active filters', () => {
            assert.equal(fModel.isAnyFilterActive, false);
        });
    });
};
