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

/**
 * Return a component representing a link in a form of a chip
 *
 * @param {Navigation} navigation the content of the link displayed to the user
 * @param {string} label displayed chip name
 * @param {string} href the absolute URL targeted by the link
 * @param {string|string[]} additionalClasses list of css classes or string of dot separated ones like .class1.class2 ...
 * @return {vnode} the linkChip component
 */

export default function linkChip(navigation, label, href, additionalClasses = '') {
    additionalClasses = Array.isArray(additionalClasses) ? additionalClasses.join('.') : additionalClasses;
    return h(`a.btn.chip.m1.no-text-decoration${additionalClasses}`, {
        onclick: (e) => navigation.handleLinkEvent(e),
        href: href,
    }, label);
}
