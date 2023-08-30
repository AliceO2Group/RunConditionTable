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

const req = require('esm')(module);
const assert = require('assert');

const { replaceUrlParams } = req('../../../../app/public/utils/url/urlUtils');

module.exports = () => {
    const url = new URL('http://localhost:8081/?page=periods&index=_0&items-per-page=50&page-number=1');
    const targetUrl = new URL('http://localhost:8081/?page=periods&index=_0&items-per-page=50&page-number=2');
    describe('Replace URL params', () => {
        it('should return correct value', () => {
            assert(replaceUrlParams(url, {pageNumber: 2}).href === targetUrl.href);
        });
    });
};
