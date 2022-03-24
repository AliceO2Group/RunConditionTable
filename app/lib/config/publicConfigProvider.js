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

function buildPublicConfig(config) {
    const publicConfigPath = path.join(__dirname, './../../public/config.js');
    const publicConfigExist = fs.existsSync(publicConfigPath);
    if (publicConfigExist) {
        fs.rmSync(publicConfigPath);
    }
    const publicConfig = _getPublic(config);

    const codeStr = '/* eslint-disable object-curly-spacing */\n' +
    '/* eslint-disable comma-dangle */\n' +
    '/* eslint-disable indent */\n' +
    '/* eslint-disable quotes *\n/' +
    '/* eslint-disable quote-props */\n'
      + `const publicConfig = ${JSON.stringify(publicConfig, null, 2)};\n`
      + 'export { publicConfig as RCT };\n';

    fs.writeFileSync(publicConfigPath, codeStr);
}

function _getPublic(config) {
    const publicConfig = config?.public;
    return publicConfig ? publicConfig : '';
}

module.exports = {
    buildPublicConfig, _getPublic,
};
