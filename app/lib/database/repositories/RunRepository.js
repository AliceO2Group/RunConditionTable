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

const Repository = require("./Repository");
const Sequelize = require('sequelize');
const deepmerge = require('deepmerge');

/**
 * Sequelize implementation of the Repository.
 */
class RunRepository extends Repository  {
    /**
     * Returns all Run entities with associated DetectorSubsystem entities.
     *
     * @param {Object} queryClauses the find query (see sequelize findAll options) or a find query builder
     * @returns {Promise<Run[]>} Promise object representing the full mock data
     */
    async findAllWithDetectors(queryClauses = {}) {
        const baseClause = {
            include: [{
                model: this.model.sequelize.models.DetectorSubsystem,
                raw:true,
                required: true,
            }],
        };
        console.log(deepmerge(baseClause, queryClauses))
        return this.model.findAll(deepmerge(baseClause, queryClauses));
    }
}

module.exports = RunRepository;
