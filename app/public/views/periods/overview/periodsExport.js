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

import dataExport from './dataExport.js';
import { RCT } from '../../../config.js';
const { periods } = RCT.pageNames;

export default function periodsExport(userPreferences, close, periodsModel) {
    // To do: move the "Capitalize the first letter" function to utils and test it
    return dataExport(userPreferences, close, periods.charAt(0).toUpperCase() + periods.slice(1), periodsModel);
}
