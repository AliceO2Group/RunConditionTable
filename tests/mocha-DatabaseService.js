/* eslint-disable no-undef */
/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

const DatabaseService = require('../lib/DatabaseService.js');
const assert = require('assert');
const sinon = require('sinon');
const { Log } = require('@aliceo2/web-ui');

describe('DatabaseService test suite', () => {
    describe('Check Initialization of DatabaseService', () => {
        it('should successfully initialize the DatabaseService', () => {
            assert.doesNotThrow(() => {
                new DatabaseService({}, new Log('Tutorial'));
            });
        });
    });

    describe('ApplicationService getData test suite', () => {
        it('should successfully send data about the project', () => {
            const databaseService = new DatabaseService({}, new Log(''));
            res = {
                status: sinon.fake.returns(),
            };
            const data = '';
            databaseService.getDate(null, res);
            console.log(res);

            /*
             * Assert.ok(res.status.calledWith(200));
             * assert.ok(res.json.calledWith(data));
             * assert.ok(res.)
             */
        });
    });
});
