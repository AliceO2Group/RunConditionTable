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
import header from '../components/common/header.js';
import dataPanel from '../components/userView/data/dataPanel.js';
import sidebar from '../components/userView/sidebar/sidebar.js';

export default function userPanel(model) {
    return h('.flex-column.absolute-fill', [
        h('header.shadow-level2.level2', [header(model)]),
        h('.flex-grow.flex-row.outline-gray', [
            sidebar(model),

            h(
                'section.outline-gray.flex-grow.relative',
                [
                    h(
                        '.scroll-y.absolute-fill.bg-white',
                        { id: 'main-content' },
                        [dataPanel(model)],
                    ),
                ],
            ),
        ]),
    ]);
}
