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

class RoutesManagementHelper {
    constructor() {
        this.apiDocsJson = null;
    }

    provideRoutes(routes) {
        this.apiDocsJson = getApiDocsAsJson(routes);
    }

    async getDocs(req, res) {
        res.json(this.apiDocsJson);
    }
}

module.exports = new RoutesManagementHelper();
