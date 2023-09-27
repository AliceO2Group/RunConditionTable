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

const { qualityControlService } = require('../../services/qualityControl/QualityControlService');
const { stdDataRequestDTO } = require('../../domain/dtos');
const { validateDtoOrRepondOnFailure } = require('../utilities');
const Joi = require('joi');
const { adaptFindAndCountAllInService, isInDevMode, isInTestMode, throwWrapper } = require('../../utils');

const getUser = (session) => session?.username ??
    (isInDevMode() || isInTestMode() ? 'dev/test-anonymous' : throwWrapper('No req.session.username nor in dev or test mode'));

/**
 * List All time based qualities / flags in db including their verification
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const listAllTimeBasedFlagsHandler = async (req, res, next) => {
    const validatedDTO = await validateDtoOrRepondOnFailure(stdDataRequestDTO, req, res);
    if (validatedDTO) {
        const flags = await qualityControlService.getAllTimeBasedFlags(validatedDTO.query);
        res.json(adaptFindAndCountAllInService(flags));
    }
};

/**
 * Create time based quality flag
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const createTimeBasedQualityControlFlag = async (req, res, next) => {
    const customDTO = stdDataRequestDTO.concat(Joi.object({
        query: {
            entire: Joi.boolean().required(),
            time_end: Joi.number().optional(),
            time_start: Joi.number().optional(),
            data_pass_id: Joi.number().required(),
            run_number: Joi.number().required(),
            detector_id: Joi.number().required(),
            flag_type_id: Joi.number().required(),
        },
    }));

    const validatedDTO = await validateDtoOrRepondOnFailure(customDTO, req, res);
    if (validatedDTO) {
        const {
            entire,
            time_end,
            time_start,
            data_pass_id,
            run_number,
            detector_id,
            flag_type_id,
        } = validatedDTO.query;

        const entityParams = {
            entire,
            timeEnd: time_end,
            timeStart: time_start,
            addedBy: getUser(req.session),
            data_pass_id,
            run_number,
            detector_id,
            flag_type_id,
        };
        await qualityControlService.createTimeBasedQualityControlFlag(entityParams);
        res.sendStatus(201);
    }
};

/**
 * Create verification for quality control flag
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const createTimeBasedQualityControlFlagVerification = async (req, res, next) => {
    const customDTO = stdDataRequestDTO.concat(Joi.object({
        params: {
            qcFlagId: Joi.number().required(),
        },
    }));

    const validatedDTO = await validateDtoOrRepondOnFailure(customDTO, req, res);
    if (validatedDTO) {
        const entityParams = {
            qcf_id: validatedDTO.params.qcFlagId,
            verifiedBy: getUser(req.session),
        };
        await qualityControlService.createTimeBasedQualityControlFlagVerification(entityParams);
        res.sendStatus(201);
    }
};

/**
 * Delete quality control flag
 * @param {Object} req express HTTP request object
 * @param {Object} res express HTTP response object
 * @param {Object} next express next handler
 * @returns {undefined}
 */
const deleteTimeBasedQualityControlFlag = async (req, res, next) => {
    const customDTO = stdDataRequestDTO.concat(Joi.object({
        params: {
            qcFlagId: Joi.number().required(),
        },
    }));

    const validatedDTO = await validateDtoOrRepondOnFailure(customDTO, req, res);
    if (validatedDTO) {
        const count = await qualityControlService.deleteTimeBasedQualityControlFlag(validatedDTO.params.qcFlagId);
        if (count === 1) {
            res.sendStatus(200);
        } else {
            res.status(400).send(`No quality flag with id ${validatedDTO.params.qcFlagId}`);
        }
    }
};

module.exports = {
    listAllTimeBasedFlagsHandler,
    createTimeBasedQualityControlFlag,
    createTimeBasedQualityControlFlagVerification,
    deleteTimeBasedQualityControlFlag,
};
