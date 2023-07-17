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

module.exports = (sequelize) => {
    const Run = sequelize.define('Run', {
        runNumber: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        timeO2Start: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        timeO2End: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        timeTrgStart: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        timeTrgEnd: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        startTime: {
            type: Sequelize.VIRTUAL,
            get() {
                const timeTrgStart = this.getDataValue('timeTrgStart');
                const timeO2Start = this.getDataValue('timeO2Start');
                const runStartString = timeTrgStart ?? timeO2Start;
                return runStartString ? new Date(runStartString).getTime() : null;
            },
        },
        endTime: {
            type: Sequelize.VIRTUAL,
            get() {
                if (this.getDataValue('start') === null) {
                    return null;
                }
                const timeTrgEnd = this.getDataValue('timeTrgEnd');
                const timeO2End = this.getDataValue('timeO2End');
                const runEndString = timeTrgEnd ?? timeO2End;
                return (runEndString ? new Date(runEndString) : new Date()).getTime();
            },
        },
        runDuration: {
            type: Sequelize.VIRTUAL,
            get() {
                const { startTime, endTime } = this;
                if (!startTime) {
                    return null;
                }
                return endTime - startTime;
            },
        },
        lhcBeamEnergy: {
            type: Sequelize.FLOAT,
        },
        lhcBeamMode: {
            type: Sequelize.CHAR(32),
        },
        aliceL3Current: {
            type: Sequelize.FLOAT,
        },
        aliceDipoleCurrent: {
            type: Sequelize.FLOAT,
        },
        aliceL3Polarity: {
            type: Sequelize.CHAR(32),
        },
        aliceDipolePolarity: {
            type: Sequelize.CHAR(32),
        },
        l3CurrentVal: {
            type: Sequelize.VIRTUAL,
            get() {
                const valFN = this.getDataValue('aliceL3Current');
                const polFN = this.getDataValue('aliceL3Polarity');
                if (valFN && polFN) {
                    if (polFN == 'NEGATIVE') {
                        return - valFN;
                    } else if (polFN == 'POSITIVE') {
                        return valFN;
                    } else {
                        throw `incorrect polarity type: '${polFN}' for run: ${run.run_number}`;
                    }
                } else {
                    return null;
                }
            }
        },
        dipoleCurrentVal: {
            type: Sequelize.VIRTUAL,
            get() {
                const valFN = this.getDataValue('aliceDipoleCurrent');
                const polFN = this.getDataValue('aliceDipolePolarity');
                if (valFN && polFN) {
                    if (polFN == 'NEGATIVE') {
                        return - valFN;
                    } else if (polFN == 'POSITIVE') {
                        return valFN;
                    } else {
                        throw `incorrect polarity type: '${polFN}' for run: ${run.run_number}`;
                    }
                } else {
                    return null;
                }
            }
        },

        // lhcPeriod
        // pdpBeamType

    }, { timestamp: false });
    Run.associate = (models) => {
        Run.belongsTo(models.Period);
        Run.belongsToMany(models.DetectorSubsystem, {
            through: 'Run_DetectorSubsystems',
        });
        Run.belongsToMany(models.DataPass, {
            through: 'DataPass_Runs',
        });
        Run.belongsToMany(models.SimulationPass, {
            through: 'SimulationPass_Runs',
            foreignKey: 'runNumber',
        });
        Run.hasMany(models.QualityControlFlag);
    };

    return Run;
};
