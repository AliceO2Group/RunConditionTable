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
    const Run = sequelize.define('run', {
        runNumber: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'run_number',
        },
        timeO2Start: {
            type: Sequelize.DATE,
            field: 'time_start',
        },
        timeO2End: {
            type: Sequelize.DATE,
            field: 'time_end',
        },
        timeTrgStart: {
            type: Sequelize.DATE,
            field: 'time_trg_start',
        },
        timeTrgEnd: {
            type: Sequelize.DATE,
            field: 'time_trg_end',
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
            field: 'energy_per_beam',
        },
        l3CurrentVal: {
            type: Sequelize.FLOAT,
            field: 'l3_current',
        },
        dipoleCurrentVal: {
            type: Sequelize.FLOAT,
            field: 'dipole_current',
        },
    }, { timestamps: false });
    
    return Run;
};
