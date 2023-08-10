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

import { Observable } from '/js/src/index.js';
import { replaceUrlParams } from '../utils/url/urlUtils.js';
import { RCT } from '../config.js';
const { dataReqParams } = RCT;

const defaultRowsOnSite = 50;

export const sidebarPreferences = {
    visible: 'visible',
    collapsible: 'collapsible',
};

/** Rows per page, UI theme, Sidebar, Detector list, predefined filters */

export default class UserPreferences extends Observable {
    constructor(router) {
        super();
        this.router = router;
        this.rowsOnSite = defaultRowsOnSite;
        this.uiTheme = RCT.themes.rct;
        this.sidebarPreference = sidebarPreferences.collapsible;
        this.detectorList = RCT.detectors.reduce((obj, curr) => ({ ...obj, [curr]: true }), {});
    }

    setRowsOnSite(rowsOnSite) {
        this.rowsOnSite = rowsOnSite;
        const url = this.router.getUrl();
        const newUrl = replaceUrlParams(url, { [dataReqParams.rowsOnSite]: this.rowsOnSite });
        this.router.go(newUrl);
    }

    setUiTheme(uiTheme) {
        this.uiTheme = uiTheme;
    }

    setSidebarPreference(sidebarPreference) {
        this.sidebarPreference = sidebarPreference;
    }

    changeDetectorVisiblity(detector) {
        this.detectorList[detector] = !this.detectorList[detector];
    }
}
