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

const { throwWrapper, NotFoundEntityError } = require('../../utils');
const { QueryBuilder } = require('../utilities');

const nonTransactionalFunctions = new Set(['constructor', 'asT', '_asT'])

const getTransactionalMethodsNames = (classObj, ) => {
    const classesStack = [];
    while (typeof Object.getPrototypeOf(classObj) !== 'object') {
        classesStack.push(classObj);
        classObj = Object.getPrototypeOf(classObj);
    }

    return classesStack
        .map(cl => Object.getOwnPropertyNames(cl.prototype))
        .flat()
        .filter(name => ! nonTransactionalFunctions.has(name));
}

/**
 * Sequelize implementation of the Repository.
 */
class Repository {
    /**
     * Creates a new `Repository` instance.
     *
     * @param {Object} model The database model to use.
     */
    constructor(model) {
        this.model = model;
    }

    async count(queryClauses = new QueryBuilder()) {
        queryClauses = queryClauses instanceof QueryBuilder ? queryClauses : new QueryBuilder(queryClauses);
        return this.model.count(queryClauses.toImplementation());
    }

    /**
     * Returns all entities.
     *
     * @param {Object} queryClauses the find query (see sequelize findAll options)
     * @returns {Promise<array>} Promise object representing the full mock data
     */
    async findAll(queryClauses = new QueryBuilder()) {
        queryClauses = queryClauses instanceof QueryBuilder ? queryClauses : new QueryBuilder(queryClauses);
        return this.model.findAll(queryClauses.toImplementation());
    }

    /**
     * Returns one entity.
     *
     * @param {Object} queryClauses the find query (see sequelize findOne options)
     * @returns {Promise<Object>} Promise object representing the full mock data
     */
    async findOne(queryClauses = {}) {
        queryClauses = queryClauses instanceof QueryBuilder ? queryClauses : new QueryBuilder(queryClauses);
        queryClauses.addClause({limit: 1})
        return this.model.findOne(queryClauses.toImplementation());
    }

    /**
     * Apply a patch on a given dbObject and save the dbObject to the database
     *
     * @param {Object} dbOject the database object on which to apply the patch
     * @param {Object} patch the patch to apply
     * @return {Promise<void>} promise that resolves when the patch has been applied
     */
    async updateOne(dbOject, patch) {
        return dbOject.update(patch);
    }

     /**
     * Find a dbObject using query clause, apply given patch to it and save the dbObject to the database
     *
     * @param {Object} dbOject the database object on which to apply the patch
     * @param {Object} patch the patch to apply
     * @throws {NotFoundEntityError} if cannot find dbObject with given query clause
     * @return {Promise<void>} promise that resolves when the patch has been applied
     */
    async findOneAndUpdate(queryClauses, patch) {
        const entity = await this.model.findOne(queryClauses) ??
            throwWrapper(new NotFoundEntityError(`No entity of model ${this.model.name} for clause ${JSON.stringify(query)}`));
        await entity.update(patch);
    }

    /**
     * Create new object in db
     * @param {Object} dbObjectParams 
     */
    async create(dbObjectParams) {
        await this.model.create(dbObjectParams);
    }

    /**
     * Create new object in db
     * @param {Object} queryClauses
     */
    async removeOne(queryClauses) {
        queryClauses = queryClauses instanceof QueryBuilder ? queryClauses : new QueryBuilder(queryClauses);
        queryClauses.addClause({limit: 1})
        return await this.model.destroy(queryClauses.toImplementation());
    }

    _asT(customOptions) {
        const { sequelize } = this.model;
        getTransactionalMethodsNames(this.constructor).forEach(transactionalMethodName => {
            const boundMethodWithoutTransaction = this[transactionalMethodName].bind(this);
            this[transactionalMethodName] = async (...args) => 
                sequelize.transaction(customOptions, async (t) => { 
                    return await boundMethodWithoutTransaction(...args);
            });
        });
    }

    /**
     * Create copy of repository object which all business related methods are wrapped with sequelize.transcation(),
     * e.g: Repository.asT().findAll() is equal to sequelize.transaction((t) => Repository.findAll())
     * Module cls-hooked handles passing transaction object to sequelize queries automatically.
     * @property {Object} customOptions - options passed to sequelize.transaction(options, callback)
     * @returns {Repository}
     */
    asT(customOptions) {
        const instanceWithTransactions = new this.constructor(this.model);
        instanceWithTransactions._asT(customOptions);
        return instanceWithTransactions;
    }
}

module.exports = Repository;
