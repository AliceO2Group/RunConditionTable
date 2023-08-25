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

const { assert } = require('chai');
const config = require('../../../app/lib/config/configProvider');

module.exports = () => {
    describe('Config Provider', () => {
        it('should return config file', () => {
            assert.isNotNull(config);
        });

        it('should handle loading error properly', () => {
            // Todo
        });

        it('should provide jwt configuration', () => {
            // eslint-disable-next-line no-prototype-builtins
            assert(config.hasOwnProperty('jwt'));
        });

        it('should provide http server configuration', () => {
            // eslint-disable-next-line no-prototype-builtins
            assert(config.hasOwnProperty('http'));
        });
    });
};
