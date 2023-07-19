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


const modelsCreator = require('../models');
const Repository = require('./Repository.js');

/**
 * Object for holding repository classes defined in files in this directory. 
 * If repository is not defined here explicitly then it will be created implicitly via models mapping
 * NOTE:
 *  1. Instances are created here, so metioned files should export classes not instances.
 *  2. The object have to keep each repository under key the same as corresponding model is kept. 
 */
const specificallyDefinedRepositories = {};

module.exports = (sequelize) => {
    const modelName2Repository = Object.entries(modelsCreator(sequelize)).map(([modelName, model]) => {
        return [modelName, modelName in specificallyDefinedRepositories ? new specificallyDefinedRepositories[modelName](model) : new Repository(model)];
    });

    return Object.fromEntries(modelName2Repository);
}


