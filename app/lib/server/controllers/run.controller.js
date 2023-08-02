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

const { runService } = require('../../services/runs/RunService');
const { STDEntityDTO } = require('../../domain/dtos');
const { validateDTO } = require('../utilities');
const { filterToSequelizeWhereClause } = require('../utilities');

/**
 * List All runs in db
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const util = require('util');

const listRunsHandler = async (req, res, next) => {
    const validatedDTO = await validateDTO(STDEntityDTO, req, res);
    if (validatedDTO) {
        console.log(util.inspect(validatedDTO.query.filter, { depth: null, colors: true }));
        console.log(util.inspect(filterToSequelizeWhereClause(validatedDTO.query.filter), { depth: null, colors: true, compact:false }));

        const runs = await runService.getAll(validatedDTO.query);
        res.json({
            data: runs,
        });
    }
};

module.exports = {
    listRunsHandler,
};
