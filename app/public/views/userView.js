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

import { h } from '/js/src/index.js';
import dataPanel from './userView/data/dataPanel.js';
import sidebar from '../components/sidebar/sidebar.js';

export default function userPanel(model) {
    const submodel = model.submodels[model.mode];
    return h('.flex-column.absolute-fill', [
        h('.flex-grow.flex-row.outline-gray', [
            sidebar(submodel),
            h('section.outline-gray.flex-grow.relative.user-panel-main-content', [
                h('.scroll-y.absolute-fill',
                    { id: 'user-panel-main-content' },
                    dataPanel(submodel)),
            ]),
        ]),
    ]);
}
