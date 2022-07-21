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

const assert = require('assert');
const ResProvider = require('../../app/lib/ResProvider');
 
module.exports = () => {
    describe('Res Provider', () => {        
        describe('Sth', () => {
            it('should not throw error providing a passPhrase', () => {
                assert.doesNotThrow(() => ResProvider.passphraseProvider());
            });

            it('should not throw error providing openId', () => {
                assert.doesNotThrow(() => ResProvider.openid());
            });

            it('should not throw error providing socksProvider', () => {
                assert.doesNotThrow(() => ResProvider.socksProvider());
            });
        });
    });
};
