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

const chai = require('chai');
const {
    defaultBefore,
    defaultAfter,
    goToPage,
    expectInnerText,
} = require('../defaults');

const { expect } = chai;

module.exports = () => {
    let page;
    let browser;

    before(async () => {
        [page, browser] = await defaultBefore(page, browser);
        await page.setViewport({
            width: 1200,
            height: 720,
            deviceScaleFactor: 1,
        });
    });

    after(async () => {
        [page, browser] = await defaultAfter(page, browser);
    });

    describe('Periods overview', () => {
        it('loads the page successfully', async () => {
            const response = await goToPage(page, 'periods');

            // We expect the page to return the correct status code, making sure the server is running properly
            expect(response.status()).to.equal(200);

            // We expect the page to return the correct title, making sure there isn't another server running on this port
            const title = await page.title();
            expect(title).to.equal('RCT prototype');

            await expectInnerText(page, 'h3#page-title', 'Periods');
        }).timeout(5000);
    });
};
