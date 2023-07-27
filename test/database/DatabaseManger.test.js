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
const { databaseManager } = require('../../app/lib/database/DatabaseManager.js'); 
const assert = require('assert');

module.exports = () => {
    describe('DatabaseManagerSuite', () => {
        describe('Check Initialization of sequelize db', () => {
            it('sequlize should migrate without errors', async () => {
                await assert.doesNotReject(async () => {
                    await databaseManager.migrate();
                });
            });
        });
    });
};
