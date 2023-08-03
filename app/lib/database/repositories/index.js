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


const Repository = require('./Repository.js');

const RunRepository = require('./RunRepository.js');
/**
 * Object for holding repository classes defined in files in this directory. 
 * If repository is not defined here explicitly then it will be created implicitly via models mapping
 * NOTE:
 *  1. Instances are created here, so metioned files should export classes not instances.
 *  2. The object have to keep each repository under key the same as corresponding model is kept. 
 */
const specificallyDefinedRepositories = {
    Run: RunRepository,
};

/**
 * @see specificallyDefinedRepositories
 * It checks if specificallyDefinedRepositories is correct, if not, it throws an error.
 * @param {Object<string, Sequelize.Model>} models 
 */
const validateSpecificRepositoriesConfiguration = (models) => {
    Object.entries(specificallyDefinedRepositories).forEach(([modelName, RepoClass]) => { 
        if (! (modelName in models) || (! (RepoClass.prototype instanceof Repository))) {
            throw Error({message: `Incorrect configuration of specificallyDefinedRepositories for modelName: <${modelName}>`})
        }
    })
}

/**
 * Instantiate sequelize models repositories according to repositiry pattern.
 * @param {Object<string, Sequelize.Model>} models dict: modelName -> sequelize model, @see specificallyDefinedRepositories
 * @returns {Object<string, Repository>} dict: repositoryName -> repository instance per one model, (repositoryName = modelName + 'Repository')
 */
const repositoriesFactory = (models) => {
    validateSpecificRepositoriesConfiguration(models);

    const modelNameToRepository = Object.entries(models).map(([modelName, model]) =>
        [modelName + 'Repository',
        new (specificallyDefinedRepositories[modelName] ?? Repository) (model),
    ]);

    return Object.fromEntries(modelNameToRepository);
};


module.exports = repositoriesFactory;
