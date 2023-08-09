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
     * @param {Object} queryClauses the find query (see sequelize findAll options)
     * @returns {Promise<array>} Promise object representing the full mock data
     */
    async findAll(queryClauses = {}) {
        return this.model.findAll(queryClauses);
    }

    /**
     * Returns one entity.
     *
     * @param {Object} queryClauses the find query (see sequelize findOne options)
     * @returns {Promise<Object>} Promise object representing the full mock data
     */
    async findOne(queryClauses = {}) {
        return this.model.findOne(queryClauses);
    }
}

module.exports = Repository;
