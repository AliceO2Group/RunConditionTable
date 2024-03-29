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
 * Validates a request using the provided DTO. If the validation fails it will send an error response to the requestor.
 *
 * @param {object} dto The *dto* object represents the DTO that is used to validate the incoming request.
 * @param {object} req The *request* object represents the HTTP request and has properties for the request query
 *                         string, parameters, body, HTTP headers, and so on.
 * @param {object} res The *response* object represents the HTTP response that an Express app sends when it gets an
 *                          HTTP request.
 * @returns {Promise<object>} Returns the validated value or null if an error occurred.
 */
const validateDtoOrRepondOnFailure = async (dto, req, res) => {
    const { query, params, body } = req;
    try {
        return await dto.validateAsync({ query, params, body }, {
            abortEarly: false,
        });
    } catch (err) {
        const { details } = err;
        res.status(400).json({
            errors: details.map((error) => ({
                status: '422',
                title: 'Invalid Attribute',
                detail: error.message,
            })),
        });
    }
};

module.exports = {
    validateDtoOrRepondOnFailure,
};
