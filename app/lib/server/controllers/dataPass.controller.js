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

const { dataPassService } = require('../../services/dataPasses/DataPassService');
const { stdDataRequestDTO } = require('../../domain/dtos');
const { validateDtoOrRepondOnFailure } = require('../utilities');
const Joi = require('joi');
const { adaptFindAndCountAllInService } = require('../../utils');

/**
 * List All data passes in db
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const listDataPassesHandler = async (req, res, next) => {
    const validatedDTO = await validateDtoOrRepondOnFailure(stdDataRequestDTO, req, res);
    if (validatedDTO) {
        const dataPasses = await dataPassService.getAll(validatedDTO.query);
        res.json(adaptFindAndCountAllInService(dataPasses));
    }
};

/**
 * List data passes belonging to period which id is provided
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const listDataPassesPerPeriodHandler = async (req, res, next) => {
    const customDTO = stdDataRequestDTO.concat(Joi.object({ params: { id: Joi.number() } }));
    const validatedDTO = await validateDtoOrRepondOnFailure(customDTO, req, res);
    if (validatedDTO) {
        const dataPasses = await dataPassService.getDataPassesPerPeriod(validatedDTO.params.id, validatedDTO.query);
        res.json(adaptFindAndCountAllInService(dataPasses));
    }
};

/**
 * List data passes anchored to simulation pass which id is provided
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const listAnchoredToSimulationPass = async (req, res, next) => {
    const customDTO = stdDataRequestDTO.concat(Joi.object({ params: { id: Joi.number() } }));
    const validatedDTO = await validateDtoOrRepondOnFailure(customDTO, req, res);
    if (validatedDTO) {
        const dataPasses = await dataPassService.getAnchoredToSimulationPass(validatedDTO.params.id, validatedDTO.query);
        res.json(adaptFindAndCountAllInService(dataPasses));
    }
};

module.exports = {
    listDataPassesHandler,
    listDataPassesPerPeriodHandler,
    listAnchoredToSimulationPass,
};
