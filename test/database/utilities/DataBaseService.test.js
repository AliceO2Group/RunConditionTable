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

const DataBaseService = require('../../../app/lib/database/DatabaseService');
const assert = require('assert');
const sinon = require('sinon');

module.exports = () => {
    describe('DatabaseSuite', () => {
        describe('Check Initialization of DatabaseService', () => {
            it('should successfully initialize the DatabaseService', () => {
                assert.doesNotThrow(() => {
                    new DataBaseService({});
                });
            });
        });


        describe('ApplicationService getData test suite', () => {
            it('just plays with sinon fake', () => {
                const databaseService = new DataBaseService({});
                res = {
                    status: sinon.fake.returns(500),
                };
                databaseService.getDate(null, res);
                assert.ok(res.status(100) === 500);
                assert.ok(res.status.calledWith(100));
            });
        });
    });
};
