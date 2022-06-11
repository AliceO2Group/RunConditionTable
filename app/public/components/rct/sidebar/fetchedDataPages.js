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

import {
    h,
    iconPin,
    iconEllipses,
    iconShareBoxed,
    iconReload,
    iconTrash,
} from '/js/src/index.js';

export default function fetchedDataPages(model, pageName, label) {
    const dataSubsetForPage = model.fetchedData[pageName];
    const buttons = [];
    if (pageName) {
        for (const index in dataSubsetForPage) {
            if (dataSubsetForPage[index]) {
                buttons.push(multiButtonController(model, pageName, index));
            }
        }
    }
    return h('.flex-wrap', [
        h(
            '.pageTitle',
            {
                class:
					model.router.params.page === pageName
					    ? 'currentMenuItem'
					    : '',
            },
            label,
        ),
        h('.flex-wrap.item-center.justify-center', [h('.flex-column', buttons)]),
    ]);
}

function multiButtonController(model, pageName, index) {
    const page = model.fetchedData[pageName];
    const { url } = page[index].payload;
    const dropdownID = `dropdown-${url}`;

    return h('.flex-row.appearance.w-100.m1.justify-between', [
        mainButton(model, url, pageName, index, dropdownID),
        deleteCopyReloadButtons(model, url, pageName, index, dropdownID),
    ]);
}

const mainButton = (model, url, pageName, index, dropdownID) =>
    h(
        'a.menu-item',
        {
            style: 'display:flex',
            href: url.pathname + url.search,
            onclick: (e) => model.router.handleLinkEvent(e),
            class: model.router.getUrl().href === url.href ? 'selected' : '',
        },
        deleteCopyReloadButtonsController(model, index, dropdownID, pageName),
    );

const deleteCopyReloadButtonsController = (
    model,
    index,
    dropdownID,
    pageName,
) => [
    h('span', iconPin(), ' ', index),
    h(
        'span.ph2',
        hiddenButtonsControllerObj(model, index, dropdownID, pageName),
        iconEllipses(),
    ),
];

const hiddenButtonsControllerObj = (model, index, dropdownID, pageName) => {
    const dataPointer = model.getCurrentDataPointer();
    return {
        onmouseenter: () => {
            document
                .getElementById(dropdownID)
                .classList.toggle('dropdown-open');
        },
        onmouseleave: () => {
            setTimeout(() => {
                if (
                    !document
                        .getElementById(dropdownID)
                        .classList.contains('dropdown-opened')
                ) {
                    document
                        .getElementById(dropdownID)
                        .classList.remove('dropdown-open');
                }
            }, 100);
        },
        class:
			dataPointer.index === index && dataPointer.page === pageName
			    ? 'white'
			    : 'gray',
    };
};

const deleteCopyReloadButtons = (model, url, pageName, index, dropdownID) =>
    h('.dropdown', { id: dropdownID, name: 'page-object-dropdown' }, [
        h('.dropdown-menu', revealedButtonControllerObj(dropdownID), [
            deletePageButton(model, pageName, index),
            reloadPageButton(model, pageName, index, url),
            copyLinkButton(model, pageName, index, url),
        ]),
    ]);

const revealedButtonControllerObj = (dropdownID) => ({
    onmouseenter: () => {
        document.getElementById(dropdownID).classList.toggle('dropdown-opened');
    },
    onmouseleave: () => {
        document.getElementById(dropdownID).classList.remove('dropdown-open');
        document.getElementById(dropdownID).classList.remove('dropdown-opened');
    },
});

const deletePageButton = (model, pageName, index) =>
    h(
        'a.menu-item',
        {
            onclick: () => {
                model.router.go('/'); // TODO
                model.fetchedData.delete(pageName, index);
                model.notify();
            },
        },
        iconTrash(),
    );

const reloadPageButton = (model, pageName, index, url) =>
    h(
        'a.menu-item',
        {
            onclick: () => {
                model.fetchedData
                    .reqForData(true, url)
                    .then(() => {})
                    .catch(() => {});
            },
        },
        iconReload(),
    );

const copyLinkButton = (model, pageName, index, url) =>
    h(
        'a.menu-item',
        {
            onclick: () => {
                navigator.clipboard
                    .writeText(url.toString())
                    .then(() => {})
                    .catch(() => {});
            },
        },
        iconShareBoxed(),
    );
