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

 const { parse } = require('url');
 const { get } = require('http');
 const SocksProxyAgent = require('socks-proxy-agent');
 const config = require('../config.js')
 
 class BookkeepingService {
    constructor() {
        this.endpoint = config.bookkeepingRuns.url;
        this.opts = parse(this.endpoint);
 
        let proxy = config.dev.proxy.trim();
        if (proxy !== '') {
            console.log('using proxy server %j', proxy);
            this.proxyAgent = new SocksProxyAgent(proxy);
            this.opts.agent = this.proxyAgent;
        }
    }
 
 
    getRuns () {
        let parsedData = '';
        console.log('attempting to GET %j', this.endpoint);
        get(this.opts, function (res) {
            console.log('"response" event!', res.headers);
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    parsedData = JSON.parse(rawData);
                    console.log(parsedData);
                } catch (e) {
                    console.error(e.message);
                }
            });
            /*
            res.on('data', function (chunk) {
                console.log(JSON.parse(chunk));
            })
            */
        });
        return parsedData;
    }
 }
 
 module.exports = BookkeepingService;