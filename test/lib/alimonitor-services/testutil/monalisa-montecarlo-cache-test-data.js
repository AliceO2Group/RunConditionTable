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

const fs = require('fs');
const { Cacher, ServicesEndpointsFormatter } = require('../../../../app/lib/alimonitor-services/helpers');
const { randint, choice, randomPeriodName, universalNoncontextualArrayDataGenerator, randomRunNumber, randomBeamType } = require('./common.js');

const simulationPassUnitGenerator = [
    () => `${randomPeriodName()}_${choice('acxcvbadtqehgnvbs')}pass${choice('123456789')}`,
    () => ({
        runList: [...new Set(universalNoncontextualArrayDataGenerator(randint(1, 10), randomRunNumber))].join(', '),
        generator: universalNoncontextualArrayDataGenerator(
            randint(4, 255),
            () => choice(['SOME', 'random', ' DESCRIPTION', 'FOR', 'monte', 'CARLO', 'production']),
        ).join(' '),
        jiraID: `ALIROOT-${randint(1000, 9999)}`,
        PWG: `PWG${choice('ANVTUAILNY')}${choice('ANNVIVFCQWPRQ')}`,
        requested_events: randint(1000000, 2000000),
        collision_system: randomBeamType,
        output_size: randint(3000000000000, 9000000000000),
        anchor_production: [...new Set(universalNoncontextualArrayDataGenerator(choice([1, 1, 1, 2]), randomPeriodName))].join(', '),
        anchor_pass: [...new Set(universalNoncontextualArrayDataGenerator(randint(1, 5), `apass${randint(1, 5)}`))].join(', '),
    }),
];

const MonalisaServiceMCName = 'MonalisaServiceMC';

const generateRandomMonalisaMontecarloCachedRawJsons = (size) => {
    const simulationPass = Object.fromEntries(universalNoncontextualArrayDataGenerator(size, simulationPassUnitGenerator));
    const cacheDir = Cacher.serviceCacheDir(MonalisaServiceMCName);
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
    Cacher.cache(MonalisaServiceMCName, ServicesEndpointsFormatter.mcRaw(), simulationPass);
};

const cleanCachedMonalisaMontecarloData = () => {
    fs.rmSync(Cacher.serviceCacheDir(MonalisaServiceMCName), { recursive: true, force: true });
};

module.exports = {
    generateRandomMonalisaMontecarloCachedRawJsons,
    cleanCachedMonalisaMontecarloData,
};
