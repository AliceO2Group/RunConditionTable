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

const getApiDocsAsJson = (routes) => routes.map(({ method, path, description }) => ({ method, path, description }));

/**
 * @class
 * @classdesc Controller class used for handling dependencies among routes and other controllers.
 * It uses singleton pattern.
 * Case for api/docs endpoints which needs other endpoints (router trees already parsed).
 */

class RoutesAbstractionController {
    constructor() { }

    provideRoutesForApiDocs(routes) {
        this.apiDocsJson = getApiDocsAsJson(routes);
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Returns whole api description as json
     */
    async getDocs(req, res) {
        if (!this.apiDocsJson) {
            res.status(500).json({ message: 'Server misconfigured, please, contact administrator' });
        }
        res.json(this.apiDocsJson);
    }
}

class SingletionRoutesAbstractionController {
    constructor() {
        throw 'SINGLETON';
    }

    /**
     * Get singleton instance
     * @returns {RoutesAbstractionController} Singleton instance
     */
    static getInstance() {
        if (! SingletionRoutesAbstractionController.INSTANCE) {
            SingletionRoutesAbstractionController.INSTANCE = new RoutesAbstractionController();
        }
        return SingletionRoutesAbstractionController.INSTANCE;
    }
}

module.exports = SingletionRoutesAbstractionController;
