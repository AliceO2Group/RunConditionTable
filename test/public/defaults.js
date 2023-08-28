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
const puppeteer = require('puppeteer');
const pti = require('puppeteer-to-istanbul');
const { httpServer } = require('../../app/application');
const { buildUrl } = require('../../app/public/utils/url/buildUrl');

const { expect } = chai;

/**
 * Returns the URL with correct port postfixed.
 * @returns {String} URL specific to the port specified by user/host.
 */
const getUrl = () => `http://localhost:${httpServer.address().port}`;

/**
 * Constructor to build elements before tests start.
 * @param {Object} page Puppeteer page object
 * @param {Object} browser Browser object to run tests on
 * @returns {Promise<Array>} Array of multiple objects, consisting of Page, Browser and Url.
 */
module.exports.defaultBefore = async (page, browser) => {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    page = await browser.newPage();
    await Promise.all([
        page.coverage.startJSCoverage({ resetOnNavigation: false }),
        page.coverage.startCSSCoverage(),
    ]);

    return [page, browser, getUrl()];
};

/**
 * Destructor to cleanup after tests are finished.
 * @param {Object} page Puppeteer page object
 * @param {Object} browser Browser object to run tests on
 * @returns {Promise<Array>} Array of multiple objects, consisting of Page and Browser.
 */
module.exports.defaultAfter = async (page, browser) => {
    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
    ]);

    pti.write([...jsCoverage, ...cssCoverage].filter(({ url = '' } = {}) => url.match(/\.(js|css)$/)), {
        includeHostname: false,
        storagePath: './.nyc_output/lib/public',
    });
    await browser.close();

    return [page, browser];
};

/**
 * Wait till selector is visible, then search for innertext on page.
 * @param {Object} page Puppeteer page object.
 * @param {String} selector Css selector.
 * @param {String} innerText Text to search for.
 * @returns {Promise<Boolean>} Whether the text was found on the page or not.
 */
module.exports.expectInnerText = async (page, selector, innerText) => {
    await page.waitForSelector(selector);
    const elementInnerText = await page.$eval(selector, (element) => element.innerText);
    expect(elementInnerText).to.equal(innerText);
};

/**
 * Navigates to a specific URL and waits until everything is loaded.
 *
 * @param {Page} puppeteerPage puppeteer page object
 * @param {string} url the URL to navigate to
 * @param {object} [options] navigation options
 * @param {boolean} [options.authenticate] if true, the navigation request will be authenticated with a token and test user information
 * @param {number} [options.redrawDuration] the estimated time to wait for the page to redraw
 * @returns {Promise} resolves with the navigation response
 */
const goTo = async (puppeteerPage, url, options) => {
    const { authenticate = true, redrawDuration = 20 } = options ?? {};

    const queryParameters = {};
    if (authenticate) {
        queryParameters.personid = 0;
        queryParameters.username = 'anonymous';
        queryParameters.name = 'Anonymous';
        queryParameters.access = 'admin';
        queryParameters.token = httpServer.o2TokenService.generateToken(
            queryParameters.personid,
            queryParameters.username,
            queryParameters.name,
            queryParameters.access,
        );
    }

    const response = await puppeteerPage.goto(buildUrl(url, queryParameters), { waitUntil: 'networkidle0' });
    await puppeteerPage.waitForTimeout(redrawDuration);
    return response;
};

/**
 * Goes to a specific page and waits until everything is loaded.
 * @param {Page} puppeteerPage Puppeteer page object.
 * @param {string} pageKey Value of pageKey in: URL/?page={pageKey}&...
 * @param {object} [options] navigation options
 * @param {boolean} [options.authenticate] if true, the navigation request will be authenticated with a token and test user information
 * @param {object} [options.queryParameters] query parameters to add to the page's URL
 * @returns {Promise} Switches the user to the correct page.
 */
module.exports.goToPage = (puppeteerPage, pageKey, options) => {
    const { queryParameters = {} } = options || {};
    const url = buildUrl(getUrl(), {
        page: pageKey,
        ...queryParameters,
    });
    return goTo(puppeteerPage, url);
};

/**
 * Evaluate and return the html content of a given element handler
 * @param {{evaluate}} elementHandler the puppeteer handler of the element to inspect
 * @returns {Promise<XPathResult>} the html content
 */
const getInnerHtml = async (elementHandler) => await elementHandler.evaluate((element) => element.innerHTML);

module.exports.getInnerHtml = getInnerHtml;
