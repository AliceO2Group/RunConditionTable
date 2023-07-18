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
const models = require('./models');
const { Log } = require('@aliceo2/web-ui')
const config = require('../../config');

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

        this._models = models(this.sequelize);
    }

    get models() {
        return this._models;
    }

    /**
     * Returns all available repositories.
     */
    // get repositories() {
    //     return require('./repositories');
    // }

    /**
     * Performs connection to the database, and retry until success
     *
     * @returns {Promise} resolves once the connection has been done
     */
    async connect() {
        this.logger.debug('Starting RunConditionTable database connection');
        const retryThrottle = 5000;

        let success = false;
        let failedOnce = false;
        while (!success) {
            const attemptTime = Date.now();

            const authenticationPromise = this.sequelize.authenticate();
            authenticationPromise.catch((error) => {
                const retryIn = attemptTime + retryThrottle - Date.now();
                if (!failedOnce) {
                    this.logger.error(`Error while starting RunConditionTable database connection: ${error}`);
                    failedOnce = true;
                }

                if (retryIn > 0) {
                    this.logger.debug(`New RunConditionTable database connection attempt in ${retryIn} ms`);
                }
            });

            await Promise.allSettled([
                authenticationPromise,
                new Promise((resolve) => setTimeout(() => resolve(), retryThrottle)),
            ]).then(([{ status }]) => {
                if (status !== 'rejected') {
                    success = true;
                }
            });
        }
        this.logger.debug('RunConditionTable database connected');
    }

    /**
     * Ping for database following sequelize documentation
     * @returns {Boolean} database status
     */
    async ping() {
        try {
            await this.sequelize.authenticate();
            return true;
        } catch (error) {
            this.logger.error('Database error');
            this.logger.error(error);
            return false;
        }
    }

    /**
     * Performs disconnect to the database.
     *
     * @returns {Promise} Promise object represents the outcome.
     */
    async disconnect() {
        this.logger.info('Stopping...');

        try {
            await this.sequelize.close();
        } catch (error) {
            this.logger.error(`Error while stopping: ${error}`);
            return Promise.reject(error);
        }

        this.logger.info('Stopped');
    }

    async dropAllTables() {
        this.logger.warn('Dropping all tables!');

        try {
            await this.sequelize.getQueryInterface().dropAllTables();
        } catch (error) {
            this.logger.error(`Error while dropping all tables: ${error}`);
            return Promise.reject(error);
        }

        this.logger.info('Dropped all tables!');
    }

    async sequelizeSync() {
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
