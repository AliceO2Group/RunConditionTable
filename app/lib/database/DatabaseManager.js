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
const { Umzug, SequelizeStorage, memoryStorage } = require('umzug');
const path = require('path')
const config = require('../../config');
const modelsFactory = require('./models');
const repositoriesFactory = require('./repositories');
const cls = require('cls-hooked');

/**
 * Sequelize implementation of the Database.
 */
class DatabaseManager {
    constructor() {
        this.logger = new Log(DatabaseManager.name);
        this.schema = 'public';
        const o2rct_namespace = cls.createNamespace('o2rct-namespace');
        Sequelize.useCLS(o2rct_namespace);

        this.sequelize = new Sequelize({
            ...config.database,
            username: config.database.user, // TEMPORARILY
            logging: config.database.logging ? this.logger.debug.bind(this.logger) : false,
            dialect: 'postgres',
            define: {
                underscored: true,
                schema: this.schema,
            },
        });
        this.models = modelsFactory(this.sequelize);
        this.repositories = repositoriesFactory(this.models);
    }

    /**
     * Executes every *pending* migrations.
     *
     * @returns {Promise} Promise object represents the outcome.
     */
    async migrate() {
        this.logger.info('Executing pending migrations...');

        try {
            const umzug = this.getUmzug(
                path.join(__dirname, 'migrations'),
                new SequelizeStorage({
                    sequelize: this.sequelize,
                }),
            );

            await umzug.up();
        } catch (error) {
            this.logger.error(`Error while executing migrations: ${error}`);
            return Promise.reject(error);
        }

        this.logger.info('Executed pending migrations');
    }

    /**
     * Returns a new Umzug instance for the given migration directory and storage
     *
     * @param {string} migrationsDirectory the path to the migrations directory
     * @param {string} storage the data storage to use
     * @return {Umzug} the Umzug instance
     */
    getUmzug(migrationsDirectory, storage) {
        return new Umzug({
            migrations: {
                glob: `${migrationsDirectory}/*.js`,
                resolve: ({ name, path: migrationPath, context }) => {
                    const migration = require(migrationPath || '');

                    return {
                        name,
                        up: async () => migration.up(context, Sequelize),
                        down: async () => migration.down(context, Sequelize),
                    };
                },
            },
            context: this.sequelize.getQueryInterface(),
            storage,
        });
    }
}

module.exports = {
    databaseManager: new DatabaseManager(),
};
