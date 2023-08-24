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
    return Math.abs(closest - energy) <= acceptableMargin
        ? Object.keys(definedEnergies).find((key) => definedEnergies[key] === closest)
        : energy.toString();
};

export const detectorName = (detectorFieldName) => isDetectorField(detectorFieldName)
    ? detectorFieldName.slice(0, 3).toUpperCase()
    : null;

export const isDetectorField = (fieldName) => /.*_detector/.test(fieldName);

export const shouldDisplayDetectorField = (fieldName, detectorList) => isDetectorField(fieldName) && detectorList[detectorName(fieldName)];

export const rowDisplayStyle = (isMarked, shouldHideMarkedRecords) => isMarked
    ? shouldHideMarkedRecords
        ? '.none'
        : '.row-selected'
    : '.row-not-selected';

/**
 * Converts bytes into human readable file size string
 * @param {number} fileSizeInBytes in bytes
 * @returns {string} human readable file size
 */
export const getReadableFileSizeString = (fileSizeInBytes) => {
    const byteUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const result = byteUnits.reduce((acc, _current) => acc.fileSize > 1024
        ? { index: acc.index + 1, fileSize: acc.fileSize / 1024 }
        : acc, { index: 0, fileSize: fileSizeInBytes / 1024 });

    return `${Math.max(result.fileSize, 0.1).toFixed(1)} ${byteUnits[result.index]}`;
};

export const pageTitle = (page, pageNames) => {
    switch (page) {
        case pageNames.periods: return 'Periods';
        case pageNames.runsPerPeriod: return 'Runs per period';
        case pageNames.runsPerDataPass: return 'Runs per data pass';
        case pageNames.dataPasses: return 'Data passes per period';
        case pageNames.mc: return 'Monte Carlo';
        case pageNames.flags: return 'Quality flags';
        case pageNames.anchoragePerDatapass: return 'Anchorage per data pass';
        case pageNames.anchoredPerMC: return 'Anchored per MC';
        default: return page;
    }
};
