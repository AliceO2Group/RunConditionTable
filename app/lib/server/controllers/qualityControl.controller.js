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

const { O2TokenService } = require('@aliceo2/web-ui');
const { jwt } = require('../../config/configProvider');
const { qualityControlService } = require('../../services/qualityControl/QualityControlService');
const { stdDataRequestDTO } = require('../../domain/dtos');
const { validateDtoOrRepondOnFailure } = require('../utilities');
const Joi = require('joi');

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
        res.json({
            data: flags,
        });
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
    const customDTO = stdDataRequestDTO.keys({
        query: {
            time_end: Joi.number().required(),
            time_start: Joi.number().required(),
            data_pass_id: Joi.number().required(),
            run_number: Joi.number().required(),
            detector_id: Joi.number().required(),
            flag_type_id: Joi.number().required(),
        },
    });

    const validatedDTO = await validateDtoOrRepondOnFailure(customDTO, req, res);
    if (validatedDTO) {
        const {
            time_end,
            time_start,
            data_pass_id,
            run_number,
            detector_id,
            flag_type_id,
        } = validatedDTO.query;

        const { token } = req.query;

        const entityParams = {
            addedBy: token ? new O2TokenService(jwt).verify(token).username : 'unspecified',
            timeEnd: time_end,
            timeStart: time_start,
            data_pass_id: data_pass_id,
            run_number: run_number,
            detector_id: detector_id,
            flag_type_id: flag_type_id,
        };
        await qualityControlService.createTimeBasedQualityControlFlag(entityParams);
        res.sendStatus(201);
    }
};

module.exports = {
    listAllTimeBasedFlagsHandler,
    createTimeBasedQualityControlFlag,
};
