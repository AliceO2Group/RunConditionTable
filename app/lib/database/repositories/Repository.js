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

/**
 * Sequelize implementation of the Repository.
 */
class Repository {
    /**
     * Creates a new `Repository` instance.
     *
     * @param {Object} model The database model to use.
     */
    constructor(model) {
        this.model = model;
    }

    async count() {
        return this.model.count();
    }

    /**
     * Returns all entities.
     *
     * @param {Object} findQuery the find query (see sequelize findAll options) or a find query builder
     * @returns {Promise<array>} Promise object representing the full mock data
     */
    async findAll(findQuery = {}) {
        return this.model.findAll(findQuery);
    }
}

module.exports = Repository;
