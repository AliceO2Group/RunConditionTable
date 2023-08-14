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

const { simulationPassService } = require('../../services/simulationPasses/SimulationPassService');
const { stdDataRequestDTO } = require('../../domain/dtos');
const { validateDtoOrRepondOnFailure } = require('../utilities');
const Joi = require('joi');

/**
 * List All simulation passes in db
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const listSimulationPassesHandler = async (req, res, next) => {
    const validatedDTO = await validateDtoOrRepondOnFailure(stdDataRequestDTO, req, res);
    if (validatedDTO) {
        const runs = await simulationPassService.getAll(validatedDTO.query);
        res.json({
            data: runs,
        });
    }
};

/**
 * List simulation passes belonging to period which id is provided
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const listSimulationPassesPerPeriodHandler = async (req, res, next) => {
    const customDTO = stdDataRequestDTO.concat(Joi.object({ params: { id: Joi.number() } }));
    const validatedDTO = await validateDtoOrRepondOnFailure(customDTO, req, res);
    if (validatedDTO) {
        const runs = await simulationPassService.getSimulationPassesPerPeriod(validatedDTO.params.id, validatedDTO.query);
        res.json({
            data: runs,
        });
    }
};

/**
 * List simulation passes which are anchored to data pass wich id is provided
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const listAnchorageForDataPassHandler = async (req, res, next) => {
    const customDTO = stdDataRequestDTO.concat(Joi.object({ params: { id: Joi.number() } }));
    const validatedDTO = await validateDtoOrRepondOnFailure(customDTO, req, res);
    if (validatedDTO) {
        const runs = await simulationPassService.getAnchorageForDataPass(validatedDTO.params.id, validatedDTO.query);
        res.json({
            data: runs,
        });
    }
};

module.exports = {
    listSimulationPassesHandler,
    listSimulationPassesPerPeriodHandler,
    listAnchorageForDataPassHandler,
};
