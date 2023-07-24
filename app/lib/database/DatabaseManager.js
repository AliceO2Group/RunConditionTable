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

const { Sequelize } = require('sequelize');
const { Log } = require('@aliceo2/web-ui')
const config = require('../../config');
const repositoriesCreator = require('./repositories');

/**
 * Sequelize implementation of the Database.
 */
class DatabaseManager {
    constructor() {
        this.logger = new Log(DatabaseManager.name);
        this.schema = 'public';

        this.sequelize = new Sequelize({
            ...config.database,
            username: config.database.user, // TEMPORARILY
            logging: config.database.logging ? this.logger.debug.bind(this.logger) : false,
            dialect: 'postgres',
            define: {
                underscored: false,
                schema: this.schema,
            },
        });
        this._repositories = repositoriesCreator(this.sequelize);
    }


    get repositories() {
        return this._repositories;
    }

    /**
     * 
     * @returns Invoke sequelize.sync()
     */
    async sync() {
        this.logger.warn('Models sync!');

        try {
            await this.sequelize.sync();
        } catch (error) {
            this.logger.error(`Error while performing models sync: ${error}`);
            return Promise.reject(error);
        }

        this.logger.info('Models synced!');
    }
}

module.exports = new DatabaseManager();
