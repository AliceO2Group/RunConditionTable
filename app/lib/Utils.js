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
class Utils {
    static filterObject(obj, keptFields, suppressUndefined = false) {
        if (!keptFields) {
            return obj;
        }
        const res = {};
        for (const [nr, nl] of Object.entries(keptFields)) {
            if (!suppressUndefined || res[nl]) {
                res[nl] = obj[nr];
            }
        }
        return res;
    }

    static adjusetObjValuesToSql(obj) {
        const res = {};
        for (const k in obj) {
            if (k) {
                res[k] = Utils.parseValueToSql(obj[k]);
            }
        }
        return res;
    }

    static parseValueToSql(v) {
        if (!v) {
            return null;
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

    static parseValuesToSql(values) {
        return values.map((v) => Utils.parseValueToSql(v));
    }

    static preserveSQLKeywords(words) {
        return words.map((w) => {
            if (['end'].includes(w)) {
                return `"${w}"`;
            } else {
                return w;
            }
        });
    }

    static simpleBuildInsertQuery(targetTable, valuesObj) {
        const entries = Object.entries(valuesObj);
        const keys = entries.map(([k, _]) => k);
        const values = entries.map(([_, v]) => v);
        return `INSERT INTO ${targetTable} (${Utils.preserveSQLKeywords(keys).join(', ')})
                VALUES(${Utils.parseValuesToSql(values).join(', ')})`;
    }

    static switchCase(caseName, cases, defaultCaseValue) {
        return Object.prototype.hasOwnProperty.call(cases, caseName) ? cases[caseName] : defaultCaseValue;
    }

    static delay(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    static replaceAll(s, pattern, replace) {
        const p = s.split(pattern);
        return p.join(replace);
    }
}

module.exports = Utils;
