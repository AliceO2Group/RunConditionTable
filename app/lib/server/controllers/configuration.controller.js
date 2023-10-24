/**
 *  @license
 *  Copyright CERN and copyright holders of ALICE O2. This software is
 *  distributed under the terms of the GNU General Public License v3 (GPL
 *  Version 3), copied verbatim in the file "COPYING".
 *
 *  See http://alice-o2.web.cern.ch/license for full licensing information.
 *
 *  In applying this license CERN does not waive the privileges and immunities
 *  granted to it by virtue of its status as an Intergovernmental Organization
 *  or submit itself to any jurisdiction.
 */

// eslint-disable-next-line valid-jsdoc

const { public: publicConfig } = require('../../../config');

const getConfigurationHandler = async (_, response) =>
    await response.status(200).type('.js').send(`window.RCT_CONF=${JSON.stringify(publicConfig)}`);

module.exports = { getConfigurationHandler };
