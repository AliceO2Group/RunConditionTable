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
const config = require('../../config/configProvider');
const { createHash } = require('crypto');

const maxSystemFileNameLength = process.env.MAX_FILE_NAME_LENGTH || 255;

class Cacher {
    static cache(synchronizerName, endpoint, data) {
        const cacheDir = Cacher.serviceCacheDir(synchronizerName);
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        fs.writeFileSync(
            Cacher.cachedFilePath(synchronizerName, endpoint),
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
            Cacher.serviceCacheDir(synchronizerName),
            Cacher.cachedFileName(endpoint),
        );
    }


    static cachedFileName(endpoint) {
        const fileExtension = '.json';
        const maxFilenameLength = maxSystemFileNameLength - fileExtension.length;
        let fileName = endpoint.searchParams.toString();
        if (fileName.length > maxFilenameLength) {
            const hash = createHash('md5').update(fileName).digest('hex');
            fileName = fileName.slice(0, maxFilenameLength - (hash.length + 1));
            fileName += `#${hash}`;
        }
        return `${fileName}${fileExtension}`;
    }

    static serviceCacheDir(synchronizerName) {
        return path.join(
            config.services.rawJsonCachePath,
            'rawJson',
            synchronizerName,
        );
    }
}

module.exports = Cacher;
