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

const Joi = require('joi');
const { emptyDTO, tokenDTO } = require('./commons.dto');

const emptyDataRequestDTO = Joi.object({
    query: emptyDTO,
    params: emptyDTO,
    body: emptyDTO,
});

/**
 * DTO that allows only:
 * query.token - webUi token
 * query.filter - object for building sequelize where-cluase
 */
const stdDataRequestDTO = Joi.object({
    query: tokenDTO.keys({
        filter: Joi.object({}).unknown(true),
        page: Joi.object({
            limit: Joi.number(),
            offset: Joi.number(),
        }),
        order: Joi.object({}).unknown(true) }), //TODO make more strict
    params: emptyDTO,
    body: emptyDTO,
});

module.exports = {
    stdDataRequestDTO,
    emptyDataRequestDTO,
};
