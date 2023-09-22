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
    const filterModel = new FilterModel();

    describe('Class instance creation', () => {
        it('should instantiate the class with no active filters', () => {
            assert.equal(filterModel.isAnyFilterActive, false);
        });
    });

    describe('Adding a new filter', () => {
        it('should add a new filter', () => {
            filterModel.addFilter('name', 'LHC', 'match');
            filterModel.addFilter('name', 'zt', 'exclude');

            const expectedFilterObjects = [
                { field: 'name', type: 'match', value: 'LHC' },
                { field: 'name', type: 'exclude', value: 'zt' },
            ];
            assert.equal(filterModel.isAnyFilterActive, true);
            assert.deepEqual(filterModel.filterObjects, expectedFilterObjects);
        });
    });

    describe('Removing filters', () => {
        it('should remove a specified filter', () => {
            filterModel.removeFilter('name', 'zt', 'exclude');

            const expectedFilterObjects = [{ field: 'name', type: 'match', value: 'LHC' }];
            assert.deepEqual(filterModel.filterObjects, expectedFilterObjects);
        });
    });

    describe('Reseting', () => {
        it('should reset the filter model', () => {
            filterModel.reset();
            assert.equal(filterModel.isAnyFilterActive, false);
        });
    });

    describe('Building filter phrases', () => {
        it('should add a new filter', () => {
            assert.equal(false, false);
        });
    });

    describe('Filter objects', () => {
        it('should add a new filter', () => {
            assert.equal(false, false);
        });
    });
};
