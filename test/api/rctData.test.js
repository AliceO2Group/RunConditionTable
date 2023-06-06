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

const request = require('supertest');
const server = require('../../app/application');
const { expect } = require('chai');

module.exports = () => {
    describe('GET /api/rctData', () => {
        it('should return 200', async () => {
            const response = await request(server)
                .get('/api/rctData');
            expect(response.status).to.equal(200);
        });
    });
};
