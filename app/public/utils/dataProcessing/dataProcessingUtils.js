/**
 * @license
 * Copyright 2019-2020 CERN and copyright holders of ALICE O2.
 * See http://alice-o2.web.cern.ch/copyright for details of the copyright holders.
 * All rights not expressly granted are reserved.
 *
 * This software is distributed under the terms of the GNU General Public
 * License v3 (GPL Version 3), copied verbatim in the file "COPYING".
 *
 * In applying this license CERN does not waive the privileges and immunities
 * granted to it by virtue of its status as an Intergovernmental Organization
 * or submit itself to any jurisdiction.
 */

export const extractPeriodName = (dataPassName) => {
    const [period] = dataPassName.split('_');
    return period;
};

export const getClosestDefinedEnergy = (energy, definedEnergies, acceptableMargin) => {
    const definedEnergyValues = Object.values(definedEnergies);
    const closest = definedEnergyValues.reduce(
        (acc, current) => Math.abs(current - energy) < Math.abs(acc - energy) ? current : acc,
        definedEnergyValues[0],
    );
    return closest - energy <= acceptableMargin ? Object.keys(definedEnergies).find((key) => definedEnergies[key] === closest) : energy;
};
