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

const Joi = require('joi');

const responseSchema = Joi.object({
    meta: Joi.object({
        totalCount: Joi.number().required(),
        pageCount: Joi.number().required(),
    }).required(),
    data: Joi.array().required(),
});

const getSelfLink = () => `${config.http.tls ? 'https' : 'http'}://localhost:${config.http.port}`;

module.exports = () => {
    describe('WebUiServerSuite', () => {
        describe('Routes definitions', () => {
            it('should parse routes correctly', () => {
                assert(routes.every((r) =>[r.method, r.path, r.controller, r.description].every((_) => _)));
                assert(routes.every(({ controller }) =>
                    (Array.isArray(controller) ? controller : [controller])
                        .every((c) => c.constructor.name === 'AsyncFunction')));
            });
        });
        describe('Routes Abstraction Controller', () => {
            it('should retrieve all endpoints description from apiDocs', () => {
                assert(apiDocumentationCotroller.apiDocsJson.length === routes.length);
            });
        });
        describe('Endpoints for fetching data', () => {
            routes.filter(({ method }) => method === 'get').map(async ({ path }) => {
                // eslint-disable-next-line max-len
                const url = new URL(`${getSelfLink()}/api${replaceAll(path, /:[^/]+/, '0')}`);
                it(`should fetch from ${path} <${url}> without errors`, async () => {
                    await assert.doesNotReject(makeHttpRequestForJSON(url));
                });
                if (url.pathname !== '/api/api-docs') {
                    it(`should fetch from ${path} <${url}> corretly formatted data`, async () => {
                        await assert.doesNotReject(responseSchema.validateAsync(await makeHttpRequestForJSON(url)));
                    });
                }
                if (url.pathname !== '/api/api-docs') { // Limit/offset are supported for endpoints which controllers based on sequelize
                    url.searchParams.append('page[limit]', 2);
                    url.searchParams.append('page[offset]', 1);
                    it(`should fetch from ${path} <${url}> without errors`, async () => {
                        await assert.doesNotReject(makeHttpRequestForJSON(url));
                    });
                }
            });
        });

        describe('Legacy endpoints for fetching data', () => {
            const params = {
                periods: {},
                dataPasses: { index: 'LHC22o' },
                mc: { index: 'LHC22o' },
                anchoredPerMC: { index: 'LHC22h1c2' },
                anchoragePerDatapass: { index: 'LHC22t_apass4' },
                runsPerPeriod: { index: 'LHC22t' },
                runsPerDataPass: { index: 'LHC22t_apass4' },
                flags: { run_numbers: 123456, detector: 'CPV', data_pass_name: 'LHC22t_apass4' },
            };
            Object.entries(params).map(([pageKey, seachQueryParams]) => {
                const url = new URL(`${getSelfLink()}/api${config.public.endpoints.rctData}?page=${config.public.pageNames[pageKey]}`);
                Object.entries(seachQueryParams).forEach(([k, v]) => url.searchParams.set(k, v));

                it(`should fetch from legacy endpoint ${url} without errors`, async () => {
                    await assert.doesNotReject(makeHttpRequestForJSON(url));
                });
            });
        });
    });
};
