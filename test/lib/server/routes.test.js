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
const { routes } = require('../../../app/lib/server/routers');
const apiDocumentationCotroller = require('../../../app/lib/server/controllers/ApiDocumentation.controller.js');
const { makeHttpRequestForJSON, replaceAll } = require('../../../app/lib/utils');
const assert = require('assert');
const config = require('../../../app/config');

module.exports = () => {
    describe('WebUiServerSuite', () => {
        describe('Routes definitions', () => {
            it('Check if routes are properly parsed', () => {
                assert(routes.every((r) =>[r.method, r.path, r.controller, r.description].every((_) => _)));
                assert(routes.every(({ controller }) =>
                    (Array.isArray(controller) ? controller : [controller])
                        .every((c) => c.constructor.name === 'AsyncFunction')));
            });
        });
        describe('Routes Abstraction Controller', () => {
            it('Check if /api/docs would return proper json', () => {
                assert(apiDocumentationCotroller.apiDocsJson.length === routes.length);
            });
        });
        describe('Endpoints', () => {
            routes.map(async ({ path }) => {
                const url = `${config.http.tls ? 'https' : 'http'}://localhost:${config.http.port}/api${replaceAll(path, /:[^/]+/, '0')}`;
                it(`Check if endpoint ${path} parametrized as ${url} works correctly`, async () => {
                    await assert.doesNotReject(makeHttpRequestForJSON(url));
                });
            });
        });
    });
};
