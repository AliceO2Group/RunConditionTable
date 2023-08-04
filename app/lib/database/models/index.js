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

const Sequelize = require('sequelize');

const BeamType = require('./BeamType.js');
const Period = require('./Period.js');
const Run = require('./Run.js');
const DataPass = require('./DataPass.js');
const DetectorSubsystem = require('./DetectorSubsystem.js');

/**
 * 
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
    };
    models = Object.entries(models).map(([modelName, model]) => [modelName, model(sequelize)]); // instantiate models
    models.forEach(([_, modelInstance]) => modelInstance.associate?.(sequelize.models)); // associate models
    models = Object.fromEntries(models);
    
    return models;
};

module.exports = modelsFactory;
