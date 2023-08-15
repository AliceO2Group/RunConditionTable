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

import periodsContent from './periodsContent.js';
import { waiting, unknown, failureWithMessage } from '../../../components/messagePanel/messages.js';

export default function periodsPanel(model) {
    const { periods } = model.periods;
    const { dataAccess } = model;

    return periods.match({
        NotAsked: () => unknown(dataAccess),
        Loading: () => waiting(),
        Success: () => periodsContent(periods.payload, model),
        Failure: (errors) => failureWithMessage(model, errors),
    });
}
