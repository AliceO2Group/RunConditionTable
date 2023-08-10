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

const getTransactionalMethods = (classObj) => {
    const classesStack = [];
    while (typeof Object.getPrototypeOf(classObj) !== 'object') {
        classesStack.push(classObj);
        classObj = Object.getPrototypeOf(classObj);
    }

    const nonSequelizeFunctions = new Set(['constructor', 'asT', '_asT'])
    return classesStack
        .map(cl => Object.getOwnPropertyNames(cl.prototype))
        .flat()
        .filter(n => ! nonSequelizeFunctions.has(n));
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
        getTransactionalMethods(this.constructor).forEach(transactionalMethod => {
            const nonTransationBoundMethod = this[transactionalMethod].bind(this);
            this[transactionalMethod] = async (...args) => 
                sequelize.transaction(async (t) => { 
                    return await nonTransationBoundMethod(...args);
            });
        });
    }

    asT() {
        const instanceWithTransactions = new this.constructor(this.model);
        instanceWithTransactions._asT();
        return instanceWithTransactions;
    }
}

module.exports = Repository;
