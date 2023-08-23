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

export const preparedData = (data) => {
    let rows = data.payload.rows.filter((item) => item.marked);
    if (!rows) {
        ({ rows } = data.payload);
    }
    const fields = data.payload.fields.filter((item) => item.marked).map((field) => field.name);

    let csv = rows.map((row) => fields.map((field) => JSON.stringify(row[field], replacer)).join(','));
    csv.unshift(fields.join(',')); // Add header column
    csv = csv.join('\r\n');

    return csv;
};

export const preparedFile = (model) => {
    const { page, index } = model.getCurrentDataPointer();

    const fileName = `${page}${page === 'periods' ? '' : `-${index}`}`;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += preparedData(model.fetchedData[page][index]);

    return { uri: encodeURI(csvContent), fileName: fileName };
};

const replacer = (key, value) => value === null ? '' : value;

/**
 * Uses deprecated data model.
 * Please use the new csv export with the specific dataModel (e.g. `periodsModel`) instead.
 * @deprecated
 * @param {DataAccessModel} model dataAccessModel
 * @returns {void} downloads the CSV file with the current data
 */
export default function obsoleteDownloadCSV(model) {
    const file = preparedFile(model);
    const link = document.createElement('a');
    link.setAttribute('href', file.uri);
    link.setAttribute('download', file.fileName);
    document.body.appendChild(link);

    link.click();
}
