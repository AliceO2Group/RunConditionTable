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

const BeamType = require('./BeamType.js');
const Period = require('./Period.js');
const Run = require('./Run.js');
const DataPass = require('./DataPass.js');
const DetectorSubsystem = require('./DetectorSubsystem.js');
const SimulationPass = require('./SimulationPass.js');
const RunDetectors = require('./RunDetectors.js');
const QualityControlFlag = require('./QualitControlFlag.js');
const QualityControlFlagVerification = require('./QualityControlFlagVerification.js');
const FlagType = require('./FlagType.js');
const ParticlesPhysData = require('./ParticilesPhysData.js');
const MetaData = require('./Meta.js');

/**
 * Prepare sequelize models instances
 * @param {Sequelize} sequelize instance
 * @returns {Object<string, Sequelize.Model>} dict modelName -> sequelize model
 */
const modelsFactory = (sequelize) => {
    let models = {
        BeamType,
        Period,
        Run,
        DataPass,
        DetectorSubsystem,
        SimulationPass,
        RunDetectors,
        QualityControlFlag,
        QualityControlFlagVerification,
        FlagType,
        ParticlesPhysData,
        MetaData,
    };
    models = Object.entries(models).map(([modelName, model]) => [modelName, model(sequelize)]); // Instantiate models
    models.forEach(([_, modelInstance]) => modelInstance.associate?.(sequelize.models)); // Associate models
    models = Object.fromEntries(models);

    return models;
};

module.exports = modelsFactory;
