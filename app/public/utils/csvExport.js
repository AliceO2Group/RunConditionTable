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





const preparedData = (data) => {
    var rows = data.payload.rows;
    // console.log(json);
    var fields = data.payload.fields.map(field => field.name);
    // console.log(fields);

    var csv = rows.map((row) => fields.map((field) => JSON.stringify(row[field], replacer)).join(','));
    csv.unshift(fields.join(',')); // add header column
    csv = csv.join('\r\n');
    console.log(csv)

    return csv;
}

const replacer = (key, value) => {
    return value === null ? '' : value;
}

export default function downloadCSV(model) {
    const page = model.router.params.page;
    const index = model.router.params.index;
    const fileName = `${page}${page === `periods`? '': `-${index}`}`;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += preparedData(model.fetchedData[page][index]);
    
    var encodedUri = encodeURI(csvContent);
    
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link); 
    
    link.click();
}