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
     * @param {Model} model The database model to use.
     */
    constructor(model) {
        this.model = model;
    }

    async count(queryBuilder = new QueryBuilder()) {
        queryBuilder = queryBuilder instanceof QueryBuilder ? queryBuilder : new QueryBuilder(queryBuilder);
        return this.model.count(queryBuilder.toImplementation());
    }

    /**
     * Returns all entities.
     *
     * @param {QueryBuilder|Object} queryBuilder the find query (see sequelize findAll options)
     * @returns {Promise<Model>} Promise object representing the full mock data
     */
    async findAll(queryBuilder = new QueryBuilder()) {
        queryBuilder = queryBuilder instanceof QueryBuilder ? queryBuilder : new QueryBuilder(queryBuilder);
        return this.model.findAll(queryBuilder.toImplementation());
    }

    /**
     * Returns one entity.
     *
     * @param {QueryBuilder|Object} queryBuilder the find query (see sequelize findOne options)
     * @returns {Promise<Model>} Promise object representing the full mock data
     */
    async findOne(queryBuilder = {}) {
        queryBuilder = queryBuilder instanceof QueryBuilder ? queryBuilder : new QueryBuilder(queryBuilder);
        queryBuilder.add({limit: 1})
        return this.model.findOne(queryBuilder.toImplementation());
    }

    /**
     * Apply a patch on a given dbObject and save the dbObject to the database
     *
     * @param {Model} dbOject the database object on which to apply the patch
     * @param {Object} patch the patch to apply
     * @return {Promise<boolean>} promise that resolves when the patch has been applied
     */
    async updateOne(dbOject, patch) {
        return dbOject.update(patch);
    }

     /**
     * Find a dbObject using query clause, apply given patch to it and save the dbObject to the database
     *
     * @param {QueryBuilder|Object} dbOject the database object on which to apply the patch
     * @param {Object} patch the patch to apply
     * @throws {NotFoundEntityError} if cannot find dbObject with given query clause
     * @return {Promise<Model>} promise that resolves when the patch has been applied
     */
    async findOneAndUpdate(queryBuilder, patch) {
        const entity = await this.model.findOne(queryBuilder) ??
            throwWrapper(new NotFoundEntityError(`No entity of model ${this.model.name} for clause ${JSON.stringify(query)}`));
        await entity.update(patch);
    }

    /**
     * Create new object in db
     * @param {Promise<Model>} dbObjectParams 
     */
    async create(dbObjectParams, opts) {
        await this.model.create(dbObjectParams, opts);
    }

    /**
     * Remove one object from database according search
     * @param {QueryBuilder|Object} queryBuilder
     * @return {Promise<boolean>} indicate if model object was deleted from db
     */
    async removeOne(queryBuilder) {
        queryBuilder = queryBuilder instanceof QueryBuilder ? queryBuilder : new QueryBuilder(queryBuilder);
        queryBuilder.add({limit: 1})
        return await this.model.destroy(queryBuilder.toImplementation()) == 1;
    }

    /**
     * Find or create model instance in db
     * @param {QueryBuilder|Object} queryBuilder
     * @return {Promise<[Model, boolean]>} 
     */
    async findOrCreate(queryBuilder) {
        queryBuilder = queryBuilder instanceof QueryBuilder ? queryBuilder : new QueryBuilder(queryBuilder);
        return await this.model.findOrCreate(queryBuilder.toImplementation());
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
