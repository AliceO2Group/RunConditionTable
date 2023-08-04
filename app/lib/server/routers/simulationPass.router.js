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

const { SimulationPassController, RunController, DataPassController } = require('../controllers');

module.exports = {
    path: '/simulation-passes',
    args: { public: false },
    children: [
        {
            method: 'get',
            controller: SimulationPassController.listSimulationPassesHandler,
            description: 'List all simulation passes which are present in DB',
        },
        {
            path: '/:id/runs',
            method: 'get',
            controller: RunController.listRunsPerSimulationPassHandler,
            description: 'List runs belonging to simulation pass which id is provided',
        },
        {
            path: '/:id/data-passes',
            method: 'get',
            controller: DataPassController.listAnchoredToSimulationPass,
            description: 'List data passes anchored to simulation pass which id is provided',
        },
    ],
};
