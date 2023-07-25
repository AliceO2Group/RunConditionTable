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

const { GetAllRunsUsecase } = require('../../usecases/runs');
const { AllRunsDTO } = require('../../domain/dtos');
const { validateDTO } = require('../utilities');

/**
 * List All runs in db
 */

const listRunsHandler = async (req, res, next) => {
    const validatedDTO = await validateDTO(AllRunsDTO, req, res);
    if (validatedDTO) {
        const runs = await GetAllRunsUsecase(validatedDTO.query);
        res.json({
            data: runs,
        });
    }
};

module.exports = {
    listRunsHandler,
};
