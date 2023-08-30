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

import { pageButtonStyle } from './styleUtils.js';
import { h } from '/js/src/index.js';

export default function pageSelector(currentPage, pagesCount, onPageChange) {
    const pageNumberButton = (targetPage) => h(`button.btn${pageButtonStyle(targetPage, currentPage)}.no-text-decoration`, {
        onclick: () => onPageChange(targetPage),
    }, targetPage);

    const pageIconButton = (targetPage, content) => h('button.btn.btn-secondary.page-changing-controller', {
        onclick: () => onPageChange(targetPage),
    }, content);

    const morePagesLeft = currentPage > 2;
    const morePagesRight = currentPage < pagesCount - 1;
    const isFirstPage = currentPage > 1;
    const isLastPage = currentPage < pagesCount;

    return h('.flex.m-right-0-3-rem',
        // Move to the first page
        isFirstPage ? pageIconButton(1, h('.double-left-15-primary')) : '',
        // Move one page back
        isFirstPage ? pageIconButton(currentPage - 1, h('.back-15-primary')) : '',

        // Move to the middle of pages range [first, current]
        morePagesLeft
            ? pageIconButton(
                Math.floor(currentPage / 2),
                h('.more-15-primary'),
            )
            : '',

        isFirstPage ? pageNumberButton(currentPage - 1) : '',
        pageNumberButton(currentPage),
        isLastPage ? pageNumberButton(currentPage + 1) : '',

        // Move to the middle of pages range [current, last]
        morePagesRight
            ? pageIconButton(
                currentPage + Math.floor((pagesCount - currentPage) / 2),
                h('.more-15-primary'),
            )
            : '',

        // Move one page forward
        isLastPage
            ? pageIconButton(
                currentPage + 1,
                h('.forward-15-primary'),
            )
            : '',

        // Move to the last page
        isLastPage
            ? pageIconButton(
                pagesCount,
                h('.double-right-15-primary'),
            )
            : '');
}
