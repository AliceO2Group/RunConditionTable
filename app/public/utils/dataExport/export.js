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

const contentTypes = {
    json: 'application/json',
    csv: 'text/csv;charset=utf-8;',
};

/**
 * Download a file
 *
 * @param {Object} content The source content.
 * @param {String} fileName The name of the file including the output format.
 * @param {String} contentType The content type of the file.
 * @return {void}
 */
const downloadFile = (content, fileName, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
};

/**
 * Create JSON export
 *
 * @param {Object} content The source content.
 * @param {String} fileName The name of the file including the output format.
 * @return {void}
 */
const createJSONExport = (content, fileName) => {
    const json = JSON.stringify(content, null, 2);
    downloadFile(json, `${fileName}.json`, contentTypes.json);
};

/**
 * Create CSV export
 *
 * @param {Object} content The source content.
 * @param {String} fileName The name of the file including the output format.
 * @return {void}
 */
const createCSVExport = (content, fileName) => {
    const csv = prepareCSVContent(content);
    downloadFile(csv, `${fileName}.csv`, contentTypes.csv);
};

export const prepareCSVContent = (content) => {
    console.log(content);
    const header = Object.keys(content[0]);
    const csv = content.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)));
    csv.unshift(header.join(','));
    console.log(csv.join('\r\n'));
    return csv.join('\r\n');
};

export const replacer = (_key, value) => value === null ? '' : value;

export {
    createJSONExport,
    createCSVExport,
};
