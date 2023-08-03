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

const { PeriodController, RunController } = require('../controllers');

module.exports = {
    path: '/periods',
    args: { public: false },
    children: [
        {
            method: 'get',
            controller: PeriodController.listPeriodsHandler,
            description: 'List all periods which are present in DB with avg energy of run\'s beams associated with them',
        },
        {
            method: 'get',
            path: '/:id/runs',
            controller: RunController.listRunsPerPeriodHandler,
            description: 'List all runs associated with period whose id is provided',
        },
    ],
};
