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
const path = require('path');
const { Cacher, ServicesEndpointsFormatter } = require('../../../../app/lib/alimonitor-services/helpers');
const { randint, choice, universalNoncontextualArrayDataGenerator } = require('./common.js');

const dataPassUnitGenerator = [
    () => `LHC${choice([18, 22, 23])}${choice('acxcvbadtqehgnvbs')}_${choice('acxcvbadtqehgnvbs')}pass${choice('123456789')}`,
    {
        reconstructed_events: () => randint(49412, 1251796425),
        description: () => [...new Array(randint(4, 255))]
            .map(() => choice(['SOME', 'random', ' DESCRIPTION', 'FOR', 'data', 'PASS'])).join(' '),
        output_size: () => randint(3.6597765e+09, 1.38163905e+14),
        interaction_type: () => choice(['pp', 'PbPb', 'pPb']),
        last_run: () => randint(500000, 600000),
    },
];

const monalisaTargetFileName = 'res_path=json.json';

const MonalisaServiceName = 'MonalisaService';
const MonalisaServiceDetailsName = 'MonalisaServiceDetails';

const dataPassDetailsUnitGenerator = {
    [Symbol(() => randint(1000000000, 2000000000))]: () => ({
        run_no: randint(1000000, 9000000),
    }),
};

const generateRandomMonalisaCachedRawJsons = () => {
    // Generate data passes
    const dataPasses = Object.fromEntries(universalNoncontextualArrayDataGenerator(10, dataPassUnitGenerator));
    let cacheDir = Cacher.serviceCacheDir(MonalisaServiceName);
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(path.join(cacheDir, monalisaTargetFileName), JSON.stringify(dataPasses, null, 2));

    // --------

    cacheDir = Cacher.serviceCacheDir(MonalisaServiceDetailsName);
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
    // Generate data passes details
    for (const dataPassName in dataPasses) {
        const { description } = dataPasses[dataPassName];
        const dataPassDetails = universalNoncontextualArrayDataGenerator(randint(1, 50), dataPassDetailsUnitGenerator);
        fs.writeFileSync(
            Cacher.cachedFilePath(MonalisaServiceDetailsName, ServicesEndpointsFormatter.dataPassesDetailed(description)),
            JSON.stringify(dataPassDetails, null, 2),
        );
    }
};

const cleanCachedMonalisaData = () => {
    fs.rmSync(Cacher.serviceCacheDir(MonalisaServiceName), { recursive: true, force: true });
    fs.rmSync(Cacher.serviceCacheDir(MonalisaServiceDetailsName), { recursive: true, force: true });
};

module.exports = {
    generateRandomMonalisaCachedRawJsons,
    cleanCachedMonalisaData,
};
