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

const { HttpServer } = require('@aliceo2/web-ui');
const AuthControlManager = require('../lib/other/AuthControlManager.js');
const path = require('path');
const config = require('../lib/config/configProvider.js');

const EP = config.public.endpoints;

/**
 * WebUI implementation of the Server.
 */
class WebUiServer {
    /**
     * Creates a new `WebUi Server` instance.
     */
    constructor() {
        this.httpServer = new HttpServer(config.http, config.jwt, config.openId ? config.openId : null);
        this.defineStaticRoutes();
        this.buildAuthControl();
    }

    /**
     * Returns the bound address, the address family name, and port of the server.
     *
     * @returns {Object} Object represents the bound address, the address family name, and port of the server.
     */
    address() {
        return this.httpServer.address();
    }

    defineStaticRoutes() {
        const { httpServer } = this;

        httpServer.addStaticPath(path.join(__dirname, '..', 'public'));
        httpServer.addStaticPath(path.join(__dirname, '../..', 'node_modules', 'less/dist'), '/scripts');
    }

    buildAuthControl() {
        this.authControlManager = new AuthControlManager(this.httpServer);
        this.authControlManager.bindToTokenControl(EP.authControl);
    }
}

exports.WebUiServer = WebUiServer;
