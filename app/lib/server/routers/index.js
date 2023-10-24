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

const { controllerHandlerWrapper } = require('../utilities');
const apiDocumentationCotroller = require('../controllers/ApiDocumentation.controller.js');
const periodRouter = require('./period.router.js');
const runRouter = require('./run.router.js');
const dataPassRouter = require('./dataPass.router.js');
const docsRouter = require('./docs.router.js');
const simulationPassRouter = require('./simulationPass.router.js');
const qualityControlRouter = require('./qualityControl.router.js');
const configurationRouter = require('./configuration.router.js');
const { isInDevMode, isInTestMode } = require('../../utils');

const routeTrees = [
    docsRouter,
    configurationRouter,
    periodRouter,
    runRouter,
    dataPassRouter,
    simulationPassRouter,
    qualityControlRouter,
];

const checkPath = (path) => {
    if (! /^(\/((:[^/: ]+)|([^/: ])+))+$/.test(path)) { // Constraints for endpoint defintions
        throw `Incorrecctly formatted path <${path}>`;
    } else {
        return path;
    }
};

function buildRoute(controllerTree) {
    const routesStack = [];
    const parseControllerTree = (constrollerSubtree, path, args) => {
        constrollerSubtree.children
            ?.forEach((child) => parseControllerTree(child, child.path ? path + checkPath(child.path) : path, { ...args, ...child.args }));

        const { method, controller, description } = constrollerSubtree;
        if (constrollerSubtree.method && constrollerSubtree.controller) {
            if (isInDevMode() || isInTestMode()) {
                args.public = true;
            }
            routesStack.push({ method, path, controller: controllerHandlerWrapper(controller), args, description });
        } else if (method && ! controller || ! method && controller) {
            throw `Routers incorrect configuration for ${path}, [method: '${method}'], [controller: '${controller}']`;
        }
    };
    parseControllerTree(controllerTree, controllerTree.path, controllerTree.args);

    return routesStack;
}

const routes = routeTrees.map(buildRoute).flat();
apiDocumentationCotroller.provideRoutesForApiDocs(routes);

/**
 * Take WebUi http server and bind all endpoints
 * @param {HttpServer} httpServer server
 * @return {undefined}
 */
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
