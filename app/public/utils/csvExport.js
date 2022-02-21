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

import {getPathElems} from "./utils.js";
import {defaultIndex} from "./defaults.js";

const preparedData = (data) => {
    const rows = data.payload.rows;
    const fields = data.payload.fields.map(field => field.name);

    let csv = rows.map((row) => fields.map((field) => JSON.stringify(row[field], replacer)).join(','));
    csv.unshift(fields.join(',')); // add header column
    csv = csv.join('\r\n');

    return csv;
}

const replacer = (key, value) => {
    return value === null ? '' : value;
}

export default function downloadCSV(model) {
    const url = model.router.getUrl();
    const pathIdents = getPathElems(url.pathname)
    const page = pathIdents[0]
    const index = defaultIndex(pathIdents[1])
    
    const fileName = `${page}${page === `periods`? '': `-${index}`}`;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += preparedData(model.fetchedData[page][index]); 
    
    const encodedUri = encodeURI(csvContent);
    
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link); 
    
    link.click();
}