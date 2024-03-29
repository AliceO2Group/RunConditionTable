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

const UtilitiesSuite = require('./utils/utils.test');
const ResProviderSuite = require('./utils/resProvider.test');
const ConfigSuite = require('./config');
const ServerSuite = require('./server');
const ServicesSuite = require('./services.test');
const SyncManagerSuite = require('./alimonitor-services/syncManager.test');

module.exports = () => {
    describe('Utilities', UtilitiesSuite);
    describe('Res Provider', ResProviderSuite);
    describe('Config', ConfigSuite);
    describe('Server', ServerSuite);
    ServicesSuite();
    SyncManagerSuite();
};
