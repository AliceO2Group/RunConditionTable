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

const run = require('./run.router.js');

const routes = [run];

function buildRoute(controllerTree) {
    const stack = [];
    const traversControllerTree = (cTree, path, args) => {
        cTree.children?.forEach((ch) => traversControllerTree(ch, path, { ...args, ...ch.args }));
        if (cTree.method && cTree.controller) {
            if (process.env.NODE_ENV === 'test') {
                args.public = true;
            }
            stack.push([cTree.method, path, cTree.controller, args]);
        }
    };
    traversControllerTree(controllerTree, controllerTree.path, controllerTree.args);
    return stack;
}

module.exports = {
    routes,
    creator: () => routes.map(buildRoute).flat(),
};
