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

const { periodService } = require('../../services/periods/PeriodService');
const { STDEntityDTO } = require('../../domain/dtos');
const { validateDTO } = require('../utilities');

/**
 * List All runs in db
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const listPeriodsHandler = async (req, res, next) => {
    const validatedDTO = await validateDTO(STDEntityDTO, req, res);
    if (validatedDTO) {
        const runs = await periodService.getAll(validatedDTO.query);
        res.json({
            data: runs,
        });
    }
};

module.exports = {
    listPeriodsHandler,
};