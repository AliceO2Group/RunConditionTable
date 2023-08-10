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

    async count() {
        return this.model.count();
    }

    /**
     * Returns all entities.
     *
     * @param {Object} queryClauses the find query (see sequelize findAll options)
     * @returns {Promise<array>} Promise object representing the full mock data
     */
    async findAll(queryClauses = {}) {
        return this.model.findAll(queryClauses);
    }

    /**
     * Returns one entity.
     *
     * @param {Object} queryClauses the find query (see sequelize findOne options)
     * @returns {Promise<Object>} Promise object representing the full mock data
     */
    async findOne(queryClauses = {}) {
        return this.model.findOne(queryClauses);
    }

    _asT() {
        const { sequelize } = this.model;
        getTransactionalMethodsNames(this.constructor).forEach(transactionalMethodName => {
            const boundMethodWithoutTransaction = this[transactionalMethodName].bind(this);
            this[transactionalMethodName] = async (...args) => 
                sequelize.transaction(async (t) => { 
                    return await boundMethodWithoutTransaction(...args);
            });
        });
    }

    /**
     * Create copy of repository object which all business related methods are wrapped with sequelize.transcation(),
     * e.g: Repository.asT().findAll() is equal to sequelize.transaction((t) => Repository.findAll())
     * Module cls-hooked handles passing transaction object to sequelize queries automatically.
     * @returns {Repository}
     */
    asT() {
        const instanceWithTransactions = new this.constructor(this.model);
        instanceWithTransactions._asT();
        return instanceWithTransactions;
    }
}

module.exports = Repository;
