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

// Import frontend framework
import {Observable, fetchClient, WebSocketClient} from '/js/src/index.js';
import sessionService from '/js/src/sessionService.js';


// The model
export default class Model extends Observable {
    constructor() {
        super();
        this.count = 0;
        this.date = null;
        this.ws = null;
        this.list = [];
        this.lastIndex = 1;
        this.hideMarkedRecords = false;
        this.logged = false;
        this.timeServerContentVisible = false;
        this.RCTHomepageVisible = false;
        this.RCTCurentContent = null;
        this.RCTdataFetched = false;

        // TODO;
        this.username = null;
        this.password = null;
        this.dbname = null;


        this._prepareWebSocket();
    }

    _prepareWebSocket() {
        // Real-time communication with server
        this.ws = new WebSocketClient();

        this.ws.addListener('authed', () => {
            console.log('ready, let send a message: ');
        });

        this.ws.addListener('command', (msg) => {
            if (msg.command === 'server-date' && msg.payload.userIndex === window.session.personid) {
                this.date = msg.payload.date;
                this.incrementResponsesNumb(msg.payload.rowIndex);
                console.log(msg.payload);
                this.notify();
            }
        });
    }

    incrementResponsesNumb(index) {
        const l = this.list.filter((e) => e.rowIndex === index)
        l[0].responses++;
    }

    increment() {
        this.count++;
        this.notify();
    }

    decrement() {
        this.count--;
        this.notify();
    }

    add(rec) {
        this.list.push(rec)
        this.lastIndex++;
        this.notify();
    }

    changeItemStatus(item) {
        item.marked = !item.marked;
        this.notify();
    }

    changeRecordsVisibility() {
        this.hideMarkedRecords = !this.hideMarkedRecords;
        this.notify();
    }

    async fetchDate() {
        const response = await fetchClient('/api/getDate', {method: 'POST'});
        const content = await response.json();
        this.date = content.date;
        this.notify();
    }

    streamDate(index, interval = 500, step = 100) {
        if (!this.ws.authed) {
            return alert('WS not authed, wait and retry');
        }
        this.ws.sendMessage({
            command: 'stream-date',
            payload: {mess: 'message from client', interval: interval, step: step, rowIndex: index, userIndex: window.session.personid}
        });
        const i = window.session.personid;
        this.ws.setFilter(function (message) {
            console.log(message);
            return message.command === 'server-date';
        });
    }

    async login(username, password, dbname) {
        if (username !== "" && password !== "") {
            const response = await fetchClient('/api/login', {
                method: 'POST',
                headers: {'Content-type': 'application/json; charset=UTF-8'},
                body: JSON.stringify({username: username, password: password, dbname: dbname})
            });
            const content = await response.json();
            console.log(content)
            if (content.type === 'err') {
                if (content.data === '28P01') alert('authentication failed');
                else {
                    alert("error: " + content.data);
                }
            } else {
                if (content.type === 'res') {
                    window.session.name = username;
                    window.session.username = username;
                    window.session.personid = content.id;
                    this.username = username;
                    this.password = password;
                    this.dbname = dbname;

                    sessionStorage.username = username;
                    sessionStorage.dbname = dbname;
                    sessionStorage.token = "";

                    console.log("sessionService_________________________")
                    console.log(sessionService);
                    sessionService.username = username;

                    this.logged = true;
                    this.notify();
                }
            }

        } else {
            alert("Incorrect inforamtion");
        }

    }

    async logout() {
        const response = await fetchClient('/api/logout', {
            method: 'POST',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({username: window.session.username, id: window.session.personid})
        });
        const content = await response.json();
        console.log(content)
        if (content.type === 'err') {
            alert("Some error occurred: " + content.data);
        } else {
            if (content.type === 'res') {
                alert('successfully logged out');
                window.session.name = 'Anonymous';
                window.session.username = 'Anonymous';
                window.session.personid = 0;
            }
        }
        this.logged = false;
        this.notify();
    }

    showHideTimeServerContent() {
        this.timeServerContentVisible = !this.timeServerContentVisible;
        if (this.timeServerContentVisible) this.RCTHomepageVisible = false;
        this.notify();
    }

    showHideRCTHomepage() {
        this.RCTHomepageVisible = !this.RCTHomepageVisible;
        if (this.RCTHomepageVisible) this.timeServerContentVisible = false;
        this.notify();
        if (!this.RCTdataFetched) {
            this.reqServerForRCTHomepage().then(r => {
                console.log(this.RCTCurentContent);
            })
        }
    }

    async reqServerForRCTHomepage(){
        const response = await fetchClient('/api/RCTHomepage', {
            method: 'POST',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({username: this.username, password: this.password, dbname: this.dbname})
        });

        const content = await response.json()
        this.RCTCurentContent = content.data.map(item => {item.marked = false; return item;});
        this.RCTdataFetched = true;
        console.log(this.RCTCurentContent);
        this.notify();
    }
}
