/**
 *
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

const keywords = ['DEFAULT', 'NULL'];

function adjusetObjValuesToSql(obj) {
    const res = {};
    for (const k in obj) {
        const v = obj[k];
        if (v) {
            if (typeof v == 'object') {
                if (Array.isArray(v)) {
                    res[k] = `ARRAY[${parseValuesToSql(v).join(',')}]`;
                } else {
                    res[k] = adjusetObjValuesToSql(v);
                }
            } else {
                res[k] = parseValuesToSql(v);
            }
        } else {
            res[k] = null;
        }
    }
    return res;
}

function parseValuesToSql(v) {
    if (!v) {
        return null;
    }

    if (Array.isArray(v)) {
        return v.map((vv) => parseValuesToSql(vv));
    }

    if (typeof v == 'string' && !keywords.includes(v.toUpperCase())) {
        if (v.length == 0) {
            return null;
        } else {
            return `'${v}'`;
        }
    } else {
        return v;
    }
}

function preserveSQLKeywords(words) {
    return words.map((w) => {
        if (['end'].includes(w)) {
            return `"${w}"`;
        } else {
            return w;
        }
    });
}

function simpleBuildInsertQuery(targetTable, valuesObj) {
    return `INSERT INTO ${targetTable}(${preserveSQLKeywords(Object.keys(valuesObj)).join(', ')})
            VALUES(${parseValuesToSql(Object.values(valuesObj)).join(', ')})`;
}

module.exports = {
    adjusetObjValuesToSql,
    parseValuesToSql,
    preserveSQLKeywords,
    simpleBuildInsertQuery,
};
