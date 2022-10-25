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
import { RCT } from '../../../config.js';
import { copyReloadButtons, hiddenButtonsControllerObj } from './multiButtonController.js';
const { dataReqParams } = RCT;

function defaultHref(page, index) {
    return `/?page=${page}${index ? `&${index}` : ''}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1`;
}

export default function alonePageButton(model, page, title, index = null) {
    const currentPointer = model.getCurrentDataPointer();
    const currentPage = currentPointer.page;

    const remoteData = model.getRemoteData(page, index);
    const data = remoteData?.payload;

    const dataHref = data ? remoteData.match({
        NotAsked: () => {
            throw 'fatal error in logic;; need to summon';
        },
        Loading: () => data.url.href,
        Success: () => data.url.href,
        Failure: (status) => {
            alert('error with url: ', data.url, status);
            return defaultHref(page, index);
        },
    }) : defaultHref(page, index);

    const titleWithChevron = currentPage === page
        ? h('div',
            h('div.vertical-center',
                h('div.current-page',
                    h('div.title-text-relative.hidden', title))),
            h('div.chevron-right-30.vertical-center'),
            h('div.title-text.vertical-center', title))
        : h('div',
            h('div.chevron-down-30.vertical-center'),
            h('div.title-text.vertical-center', title));

    const dropdownID = `dropdown-${dataHref}`;
    return [
        h('a.page-title', {
            title: title,
            class: currentPage === page ? 'selected' : '',
            href: dataHref,
            onclick: (e) => model.router.handleLinkEvent(e),
        }, [
            h('div',
                hiddenButtonsControllerObj(model, index, dropdownID, page),
                titleWithChevron,
                '    ',
                copyReloadButtons(model, dataHref, page, index, dropdownID)),
        ]),
    ];
}
