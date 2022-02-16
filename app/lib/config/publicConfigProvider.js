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

/**
 * Removes (if exists) and creates a new config file which is to be sent to the client side for fixed configurations
 * The configuration file is based on `config.js` file
 * @param {JSON} config 
 */
function buildPublicConfig(config) {
  const publicConfigPath = path.join(__dirname, './../../public/config.js');
  const publicConfigExist = fs.existsSync(publicConfigPath);
  if (publicConfigExist) {
    fs.rmSync(publicConfigPath);
  }
  const publicConfig = _getPublic(config);
  let codeStr = `/* eslint-disable quote-props */\n`
      + `const publicConfig = ${JSON.stringify(publicConfig, null, 2)};\n`
      + `export {publicConfig as RCT};\n`;

  fs.writeFileSync(publicConfigPath, codeStr);
  console.log('public config installed')
}

/**
 * Builds the URL of the Bookkeeping GUI and returns it as a string
 * Returns empty string if no configuration is provided for Bookkeeping
 * @param {JSON} config - server configuration
 * @returns {string}
 */
function _getBookkeepingURL(config) {
  const bkp = config?.bookkeepingRuns;
  return (bkp?.url) ? `${bkp.url}` : '';
}

function _getPublic(config) {
  const public = config?.public;
  return public? public : '';
}

module.exports = {
  buildPublicConfig, _getBookkeepingURL, _getPublic
};
