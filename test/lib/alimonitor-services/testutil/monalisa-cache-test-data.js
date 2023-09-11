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
const { Cacher } = require('../../../../app/lib/alimonitor-services/helpers');
const { randint, choice } = require('./common.js');

const keptFields = {
    name: () => `LHC${choice([18, 22, 23])}_${choice('acxcvbadtqehgnvbs')}pass${choice('123456789')}`,
    reconstructed_events: () => randint(49412, 1251796425),
    description: () => [...new Array(randint(4, 255))].map(() => choice(['SOME', 'random', ' DESCRIPTION', 'FOR', 'data', 'PASS'])).join(' '),
    output_size: () => randint(3.6597765e+09, 1.38163905e+14),
    interaction_type: () => choice(['pp', 'PbPb', 'pPb']),
    last_run: () => randint(500000, 600000),
};

const genSingleDataPass = () => Object.fromEntries(
    Object.entries(keptFields)
        .map(([runField, fieldDataGenerator]) => [runField, fieldDataGenerator()]),
);

const genDataPassesBatch = (size) => [...new Array(size)].map(genSingleDataPass);

const monalisaTargetFileName = 'res_path=json.json';

const MonalisaServiceName = 'MonalisaService';
const MonalisaServiceDetailsName = 'MonalisaServiceDetails';

const exDet = {
    [Symbol(() => randint(1000000000, 2000000000))]: () => ({
        run_no: randint(1000000, 9000000),
    }),
};

const universalUnitGenerator = (unitGenerator) => {
    if (typeof unitGenerator === 'function') {
        return unitGenerator();
    }
    if (typeof unitGenerator === 'object') {
        if (Array.isArray(unitGenerator)) {
            throw new Error('unitGenerator cannot be array');
        }
        // First generation pass (object names only)
        const partialResult = Object.fromEntries(
            ...Object.entries(unitGenerator).map(([k, v]) => [k, universalUnitGenerator(v)]),
            ...Object.getOwnPropertySymbols((symbol) => [eval(symbol.description)(), universalUnitGenerator(unitGenerator[symbol])]),
        )
    }
}
const universalArrayDataGenerator = (size, unitGenerator) => {

}


const generateRandomMonalisaCachedRawJsons = () => {
    const dataPasses = genDataPassesBatch(100);
    const cacheDir = Cacher.serviceCacheDir(MonalisaServiceName);
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(path.join(cacheDir, monalisaTargetFileName), JSON.stringify(dataPasses, null, 2));
};

const cleanCachedMonalisaData = () => {
    fs.rmSync(Cacher.serviceCacheDir(MonalisaServiceName), { recursive: true, force: true });
};

module.exports = {
    generateRandomMonalisaCachedRawJsons,
    cleanCachedMonalisaData,
};
