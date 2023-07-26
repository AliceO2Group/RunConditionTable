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
const { databaseService } = require('../../../app/lib/database/DatabaseService');
const assert = require('assert');


module.exports = () => {
    describe('DatabaseSuite', () => {
        describe('Check Initialization of DatabaseService', () => {
            it('should connect to the database successfully', () => {
                assert.doesNotThrow(async () => {
                    await databaseService.getDate();
                    await databaseService.healthcheckInsertData();
                });
            });
        });
    });
};
