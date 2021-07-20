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

// Import the backend classes
const {HttpServer, Log, WebSocket, WebSocketMessage} = require('@aliceo2/web-ui');

// Define configuration for JWT tokens and HTTP server
const config = require('./config.js');

// Get logger instance
const log = new Log('Tutorial');
let loggedLastID = 1;
let loggedUsers = []

// HTTP server
// Instanciate the HTTP server
const httpServer = new HttpServer(config.http, config.jwt);
console.log("ip address: " + httpServer.ipAddress);

// Server static content in public directory
httpServer.addStaticPath('./public');

// Declare HTTP POST route available under "/api/getDate" path
httpServer.post('/getDate', (req, res) => {
    res.json({date: new Date()});
});

const {Client} = require('pg');

async function select(client, command) {
    await client.connect();
    const res = await client.query(command);
    await client.end();
    return res;
}
httpServer.post('/login', (req, res) => {
    const body = req.body;
    console.log(req);
    console.log('user try to log in' + body);
    const client = new Client({
        user: body.username,
        host: 'localhost',
        database: body.dbname,
        password: body.password,
        port: 5432,
    });

    select(client, 'SELECT NOW();')
        .then(sqlres => {
            res.json({type: 'res', id: loggedLastID, data: sqlres.rows});
            loggedUsers.push({id: loggedLastID, username: body.username, date: new Date(), token: req.query.token})
            loggedLastID ++;
        }).catch(e => {
        console.log(e.message);
        res.json({type: 'err', data: e.code})
    });

})
httpServer.post('/logout', (req, res) => {
    const body = req.body;
    console.log('Try to log out: ' + body.username + ", id: " + body.id);
    console.log(req);
    let found = false
    loggedUsers = loggedUsers.filter(item => {
        const cond = !(item.id === body.id
                && item.username === body.username
                && item.token === req.query.token)
        if (!cond) found = true;
        return cond;
    });
    if (found) {
        res.json({type: 'res', data: 'OK'});
    } else {
        res.json({type: 'err', data: 'NOUSER'});
    }
})
httpServer.post('/RCTHomepage', (req, res) => {
    const body = req.body;
    console.log(req);
    console.log('user try to log in' + body);
    const client = new Client({
        user: body.username,
        host: 'localhost',
        database: body.dbname,
        password: body.password,
        port: 5432,
    });

    select(client, 'SELECT * from periods;')
        .then(sqlres => {
            res.json({type: 'res', data: sqlres.rows});
        }).catch(e => {
            res.json({type: 'err', data: e.code});
    })

})


// WebSocket server
// ----------------
//
// Instanciate the WebSocket server
const wsServer = new WebSocket(httpServer);

// Define gloval variable
let streamTimer = null;
let streamTimerTimeout = null;

// Declare WebSocket callback for 'stream-date' messages
wsServer.bind('stream-date', (msg) => {
    console.log(msg);
    if (streamTimer) {
        // already started, kill it
        clearInterval(streamTimer);
        streamTimer = null;
        return;
    }

    // Use internal logging
    log.info('start timer');

    // Broadcase the time to all clients every step ms (edit)
    const  step = Number(msg.getPayload().step)
    const index = Number(msg.getPayload().rowIndex)
    const userIndex = Number(msg.getPayload().userIndex)
    streamTimer = setInterval(() => {
        wsServer.broadcast(
            new WebSocketMessage().setCommand('server-date').setPayload({date: new Date(), rowIndex: index, userIndex: userIndex})
        );
    }, step);

    let interval = Number(msg.getPayload().interval)
    streamTimerTimeout = setTimeout(() => {
        clearInterval(streamTimer);
        streamTimer = null;
        streamTimerTimeout = null;
    }, interval)
    return new WebSocketMessage().setCommand('stream-date');
});
