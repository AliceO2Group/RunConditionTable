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

const { deepmerge } = require('../../utils');
const { filterToSequelizeWhereClause } = require('../../server/utilities');

class QueryBuilder {
    constructor(initClauses) {
        this.cluasesAccumulator = {...initClauses};
    }

    addFromHttpRequest({ filter, page, order }) {
        this.cluasesAccumulator = deepmerge(this.cluasesAccumulator, {
            where: filterToSequelizeWhereClause(filter),
            ...page,
            order: order ? Object.entries(order) : null,
        })
        return this;
    }

    add(clause) {
        if (clause instanceof QueryBuilder) {
            this.cluasesAccumulator = deepmerge(this.cluasesAccumulator, clause.toImplementation())
        } else {
            this.cluasesAccumulator = deepmerge(this.cluasesAccumulator, clause);
        }
        return this;
    }

    toImplementation() {
        return this.cluasesAccumulator;
    }
}

module.exports = QueryBuilder;
