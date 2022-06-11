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

 module.exports = () => {
    describe('DatabaseSuite', () => {
        describe('should', () => {
            it('handle query with missing token', async () => {
                const dbService = new DataBaseService({});

                await dbService.execDataInsert().catch((err) => {
                    err.response.should.have.status(401);
                    err.response.body.should.have.property('error');
                    err.response.body.error.should.eql('no user with such token');
                  });
            });
        });
    });
};