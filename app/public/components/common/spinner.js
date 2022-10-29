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

export default function spinner() {
    return h('.topSpace',
        h('.center',
            h('.atom-spinner.f1',
                h('.spinner-inner',
                    h('.spinner-line'),
                    h('.spinner-line'),
                    h('.spinner-line'),
                    h('.spinner-circle', '●')))),
        h('h5', 'Loading...'));
}
