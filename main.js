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

const RunConditionTableApplication = require('./app/application.js');
const runConditionTableApplication = new RunConditionTableApplication();

runConditionTableApplication.run()
    .then(r => r)
    .catch(e => e)

/**
 * signals handlers
 */
const signals = ['SIGTERM', 'SIGINT', 'SIGHUP'];
signals.forEach((event) => process.on(event, runConditionTableApplication.stop.bind(runConditionTableApplication)));
