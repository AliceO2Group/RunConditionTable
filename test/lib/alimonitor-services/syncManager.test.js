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

const { syncManager } = require('../../../app/lib/alimonitor-services/SyncManager.js');
const { generateRandomBookkeepingCachedRawJsons } = require('./testutil/cache-for-test.js');
const assert = require('assert');

module.exports = () => describe('SyncManager suite', () => {
    before(() => {
        generateRandomBookkeepingCachedRawJsons();
    });

    describe('BookkeepingService suite', () => {
        it('should performe sync with random data withour errors', async () => {
            await assert.doesNotReject(syncManager.services.bookkeepingService.setSyncTask());
        });
    });
});
