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

const DatabaseSuite = require('./database');
const ApiSuite = require('./api');
const PublicSuite = require('./public');
const LibSuite = require('./lib');
const assert = require('assert');

const application = require('../app/application.js');

describe('Run Condition Table', () => {
    before(async () => {
        await application.run();
    });

    after(async () => {
        await application.stop(true);
    });
  
    describe('App initialization', () => {
        it('should initialize the app instance', () => {
            assert.doesNotThrow(async () => {
                app = new Application({});
                await app.stop()
            });
        });
    });
    
    describe('Unit Suite', () => {
      describe('Database', DatabaseSuite);
      describe('API', ApiSuite),
      describe('Public', PublicSuite);
      describe('Lib', LibSuite);
    });
});
