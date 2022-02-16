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
 const http = require('http');
 const https = require('https');
 const SocksProxyAgent = require('socks-proxy-agent');
 const config = require('./config/configProvider.js');
 const {Log} = require("@aliceo2/web-ui");



const wait = (seconds) =>
    new Promise(resolve =>
        setTimeout(() =>
            resolve(true), seconds * 1000))


 class BookkeepingService {
     constructor() {
         this.endpoint = config.bookkeepingRuns.urlOldBookkeeping;
         this.opts = parse(this.endpoint);
         this.logger = new Log();

         let proxy = config.dev.proxy.trim();
         if (proxy !== '') {
             this.logger.info('using proxy server %j', proxy);
             this.proxyAgent = new SocksProxyAgent(proxy);
             this.opts.agent = this.proxyAgent;
         }
         const protocol = this.endpoint.split(':')[0]
         switch (protocol) {
             case 'http':
                 this.client = http;
                 console.log('proto http')
                 break;
             case 'https':
                 this.client = https;
                 console.log('proto https')
                 break;
             default:
                 console.log('unspecified protocol in url')
                 break;
         }
     }



     async getRuns() {
         return new Promise(async (resolve, reject) => {

             let rawData = '';

             const req = this.client.request(this.opts, res => {
                 res.on('data', chunk => rawData += chunk);
                 res.on('end', () => {
                     const data = JSON.parse(rawData);
                     resolve(data);
                 });
             });
             req.on('error', e => {
                 console.log(`ERROR httpGet: ${e}`);
                 reject(e);
             });
             req.end();
         });
     }




     getRuns__() {
         let parsedData = {};
         this.logger.info('attempting to GET %j', this.endpoint);
         const logger = this.logger

         const req = http.get(this.opts, res => {
                 logger.info('response event!', res.headers);
                 res.setEncoding('utf8');
                 let rawData = '';
                 res.on('data', (chunk) => {
                     rawData += chunk;
                 });
                 res.on('end', () => {
                     try {
                         parsedData.a = JSON.parse(rawData);
                         // console.log(parsedData.a);
                     } catch (e) {
                         console.error(e.message);
                     }
                 });
             }
         );

         req.end();
         return parsedData;
     }

 }

 module.exports = BookkeepingService;