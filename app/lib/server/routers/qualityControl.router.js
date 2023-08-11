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

const { QualityControlController } = require('../controllers');

module.exports = {
    path: '/quality-control',
    args: { public: false },
    children: [
        {
            path: '/time-based',
            method: 'get',
            controller: QualityControlController.listAllTimeBasedFlagsHandler,
            description: 'List all time based qualities / flags present in DB, including their verifications',

            children: [
                {
                    path: '/create',
                    method: 'post',
                    controller: QualityControlController.createTimeBasedQualityControlFlag,
                    description: 'Create quality control flag instance',
                },
                {
                    path: '/:qcFlagId/verify',
                    method: 'post',
                    controller: QualityControlController.createTimeBasedQualityControlFlagVerification,
                    description: 'Verify flag with given id',
                },
            ],
        },
    ],
};
