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

export const buttonClasses = {
    primary: '.btn-primary',
    secondary: '.btn-secondary',
};

export const pageButtonStyle = (targetPage, currentPage) => targetPage === currentPage
    ? buttonClasses.primary
    : buttonClasses.secondary;

export const pagerButtonConditions = (currentPage, pagesCount) => ({
    goToFirstPage: currentPage > 1,
    goOnePageBack: currentPage > 1,
    goMiddleBack: currentPage > 2,
    goMiddleForward: currentPage < pagesCount - 1,
    goOnePageForward: currentPage !== pagesCount,
    goToLastPage: currentPage !== pagesCount,
});
