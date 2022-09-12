/**
 *
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
const path = require('path');
const fs = require('fs');

class Cacher {
    static cache(synchronizerName, endpoint, data) {
        const cacheDir = Cacher.serivceCacheDir(synchronizerName);
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        fs.writeFileSync(
            path.join(cacheDir, endpoint.searchParams.toString()),
            JSON.stringify(data, null, 2),
        );
    }

    static isCached(synchronizerName, endpoint) {
        return fs.existsSync(Cacher.cachedFilePath(synchronizerName, endpoint));
    }

    static getJsonSync(synchronizerName, endpoint) {
        return JSON.parse(fs.readFileSync(Cacher.cachedFilePath(synchronizerName, endpoint)));
    }

    static async getJson(synchronizerName, endpoint) {
        return await fs.readFile(Cacher.cachedFilePath(synchronizerName, endpoint))
            .then((r) => JSON.parse(r));
    }

    static cachedFilePath(synchronizerName, endpoint) {
        return path.join(
            Cacher.serivceCacheDir(synchronizerName),
            Cacher.cachedFileName(endpoint),
        );
    }

    static cachedFileName(endpoint) {
        return endpoint.searchParams.toString();
    }

    static serivceCacheDir(synchronizerName) {
        return path.join(
            __dirname,
            '..',
            '..',
            '..',
            'database',
            'cache',
            'rawJson',
            synchronizerName,
        );
    }
}

module.exports = Cacher;
