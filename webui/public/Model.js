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


// The model
export default class Model extends Observable {
    constructor() {
        super();
        this.count = 0;
        this.date = null;
        this.ws = null;
        this.timeServerList = [];
        this.lastIndex = 1;
        this.hideMarkedRecords = false;
        this.logged = false;

        this.contentVisibility = {
            timeServerContentVisible: false,
            RCTHomepageVisible: false
        }
        this.currentContent = null;

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
            if (msg.command === 'server-date' && msg.payload.userIndex === window.sesService.session.personid) {
                this.date = msg.payload.date;
                this.incrementResponsesNumb(msg.payload.rowIndex);
                console.log(msg.payload);
                this.notify();
            }
        });
    }

    incrementResponsesNumb(index) {
        const l = this.timeServerList.filter((e) => e.rowIndex === index)
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
        this.timeServerList.push(rec)
        this.lastIndex++;
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
            payload: {mess: 'message from client', interval: interval, step: step, rowIndex: index, userIndex: window.sesService.session.personid}
        });
        const i = window.sesService.session.personid;
        this.ws.setFilter(function (message) {
            console.log(message);
            return message.command === 'server-date';
        });
    }

    changeItemStatus(item) {
        item.marked = !item.marked;
        this.notify();
    }

    changeRecordsVisibility() {
        this.hideMarkedRecords = !this.hideMarkedRecords;
        this.notify();
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
                    window.sesService.session.username = username;
                    window.sesService.session.name = username;
                    window.sesService.session.personid = content.id;
                    this.username = username;
                    this.password = password;
                    this.dbname = dbname;
                    sessionStorage.logged = "true";
                    sessionStorage.username = username;
                    sessionStorage.token =  sesService.session.token;
                    sessionStorage.dbname = dbname;
                    sessionStorage.password = password;

                    this.logged = true;
                    this.notify();
                }
            }

        } else {
            alert("Incorrect information");
        }

    }

    async logout() {
        const response = await fetchClient('/api/logout', {
            method: 'POST',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({username: window.sesService.session.username, id: window.sesService.session.personid})
        });
        const content = await response.json();
        console.log(content)
        if (content.type === 'err') {
            alert("Some error occurred: " + content.data);
        } else {
            if (content.type === 'res') {
                alert('successfully logged out');
                window.sesService.session.name = 'Anonymous';
                window.sesService.session.username = 'Anonymous';
                window.sesService.session.personid = 0;
            }
        }
        this.logged = false;
        sessionStorage.logged = "false";
        sessionStorage.username = null;
        sessionStorage.password = null;
        sessionStorage.dbname = null;

        this.notify();
    }


    showHideTimeServerContent() {
        if (this.contentVisibility.timeServerContentVisible) {
            this.contentVisibility.timeServerContentVisible = false;
            this.currentContent = null;
        } else {
            if (this.currentContent !== null)
                this.contentVisibility[this.currentContent] = false;
            this.contentVisibility.timeServerContentVisible = true;
            this.currentContent = "timeServerContentVisible";
        }
        this.notify();
    }

    showHideRCTHomepage() {
        if (this.contentVisibility.RCTHomepageVisible) {
            this.contentVisibility.RCTHomepageVisible = false;
            this.currentContent = null;
        } else {
            if (this.currentContent !== null)
                this.contentVisibility[this.currentContent] = false;
            this.contentVisibility.RCTHomepageVisible = true;
            this.currentContent = "RCTHomepageVisible";
        }
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
