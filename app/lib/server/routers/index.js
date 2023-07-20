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
const metaRouter = require('./meta.router.js');

const routeTrees = [
    run,
    metaRouter,
];

const checkPath = (path) => {
    if (! /^(\/((:[^/: ]+)|([^/: ])+))+$/.test(path)) { // Constraints for endpoint defintions
        throw `Incorrecctly formatted path <${path}>`;
    } else {
        return path;
    }
};

function buildRoute(controllerTree) {
    const stack = [];
    const traversControllerTree = (cTree, path, args) => {
        cTree.children?.forEach((ch) => traversControllerTree(ch, ch.path ? path + checkPath(ch.path) : path, { ...args, ...ch.args }));

        const { method, controller, description } = cTree;
        if (cTree.method && cTree.controller) {
            if (process.env.ENV_MODE === 'test' || process.env.ENV_MODE === 'dev') {
                args.public = true;
            }
            stack.push({ method, path, controller, args, description });
        } else if (method && ! controller || ! method && controller) {
            throw `Routers incorrect configuration for ${path}, [method: '${method}'], [controller: '${controller}']`;
        }
    };
    traversControllerTree(controllerTree, controllerTree.path, controllerTree.args);
    return stack;
}

const routes = routeTrees.map(buildRoute).flat();
metaRouter.routesAbstration.provideRoutes(routes);

const bindApiEndpoints = (httpServer) => routes.forEach((route) => {
    if (route.args) {
        httpServer[route.method](route.path, route.controller, route.args);
    } else {
        httpServer[route.method](route.path, route.controller);
    }
});

module.exports = {
    bindApiEndpoints,
    routes,
};
