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

import { h, iconDataTransferDownload, iconReload, iconShareBoxed } from '/js/src/index.js';
import downloadCSV from '../../../../utils/csvExport.js';
import tableHeader from './header.js';
import row from './row.js';
import pagesCellsSpecials from '../pagesCellsSpecials.js';
import pager from '../pager.js';

import postingDataConfig from '../posting/postingDataConfig.js';
import { postForm } from '../posting/postForm.js';
import filter from './filtering/filter.js';
import activeFilters from './filtering/activeFilters.js';
import noDataView from './noDataView.js';

import { RCT } from '../../../../config.js';
import sortingRow from './sortingRow.js';
import pageSettings from '../pageSettings/pageSettings.js';
import indexChip from './indexChip.js';
import { defaultIndexString } from '../../../../utils/defaults.js';
import noSubPageSelected from './noSubPageSelected.js';
const { pagesNames } = RCT;

/**
 * Creates vnode containing table of fetched data (main content)
 * and additional features like page controller or columns visibility controller
 * @param model
 * @returns {*}
 */

export default function tablePanel(model) {
    const dataPointer = model.getCurrentDataPointer();
    const data = model.fetchedData[dataPointer.page][dataPointer.index].payload;
    const page = model.fetchedData[dataPointer.page];
    const { url } = page[dataPointer.index].payload;

    const anyFiltersActive = url.href.includes('match') || url.href.includes('exclude') || url.href.includes('from') || url.href.includes('to');
    const chips = model.getSubPages(dataPointer.page).filter((index) => index !== defaultIndexString).map((index) => indexChip(model, index));

    data.rows = data.rows.filter((item) => item.name != 'null');

    const cellsSpecials = pagesCellsSpecials[dataPointer.page];

    const { fields } = data;
    const visibleFields = fields.filter((f) => f.marked);

    const headerSpecific = (model) => {
        const { page } = model.getCurrentDataPointer();
        switch (page) {
            case 'periods': return 'Periods';
            case 'runsPerPeriod': return 'Runs per period';
            case 'runsPerDataPass': return 'Runs per data pass';
            case 'dataPasses': return 'Data passes per period';
            case 'mc': return 'Monte Carlo';
            case 'flags': return 'Flags';
            case 'anchoragePerDatapass': return 'Anchorage per data pass';
            case 'anchoredPerMC': return 'Anchored per MC';
            default: return page;
        }
    };

    const functionalities = (model) => h('.btn-group',
        h('button.btn.btn-secondary.icon-only-button', {
            onclick: () => {
                model.fetchedData.reqForData(true);
                model.notify();
            },
        }, iconReload()),

        h('button.btn.btn-secondary.icon-only-button', {
            onclick: () => {
                downloadCSV(model);
            },
        }, iconDataTransferDownload()),

        h('button.btn.btn-secondary.icon-only-button', {
            onclick: () => {
                navigator.clipboard.writeText(url.toString())
                    .then(() => {
                    })
                    .catch(() => {
                    });
            },
        }, iconShareBoxed()),

        h('button.btn.icon-only-button', {
            className: model.searchFieldsVisible ? 'btn-primary' : 'btn-secondary',
            onclick: () => model.changeSearchFieldsVisibility(),
        }, model.searchFieldsVisible ? h('.slider-20-off-white.abs-center') : h('.slider-20-primary.abs-center')));

    return dataPointer.index !== defaultIndexString || dataPointer.page == pagesNames.periods
        ? h('div.main-content', [
            h('div.flex-wrap.justify-between.items-center',
                h('div.flex-wrap.justify-between.items-center',
                    h('h3.p-right-15.text-primary', headerSpecific(model)),
                    chips,
                    h('button.btn.btn-secondary', {
                        onclick: () => {
                            document.getElementById('pageSettingsModal').style.display = 'block';
                            document.addEventListener('click', (event) => {
                                const modalContent = document.getElementsByClassName('modal-content');
                                const modal = document.getElementsByClassName('modal');
                                if (Array.from(modalContent).find((e) => e != event.target)
                                && Array.from(modal).find((e) => e == event.target)
                                && document.getElementById('pageSettingsModal')) {
                                    document.getElementById('pageSettingsModal').style.display = 'none';
                                }
                            });
                        },
                    }, h('.settings-20'))),

                h('div', functionalities(model))),
            model.searchFieldsVisible ? filter(model) : '',
            anyFiltersActive ? activeFilters(model) : '',

            data.rows?.length > 0
                ? visibleFields.length > 0
                    ? h('.p-top-10', //
                        h('.x-scrollable-table.border-sh',
                            pager(model, data, false),
                            h('table', {
                                id: `data-table-${data.url}`,
                                className: `${[pagesNames.runsPerDataPass, pagesNames.runsPerPeriod].includes(dataPointer.page)
                                    ? 'runs-table'
                                    : `${dataPointer.page}-table`}`,
                            }, [
                                tableHeader(visibleFields, data, model),
                                model.sortingRowVisible ? sortingRow(visibleFields, data, model) : '',
                                tableBody(model, visibleFields, data, cellsSpecials, dataPointer.page),
                            ]),
                            data.rows.length > 15 ? pager(model, data) : ''))
                    : ''
                : noDataView(model, dataPointer),
            h('.modal', { id: 'pageSettingsModal' },
                h('.modal-content.abs-center.p3', {
                    id: 'pageSettingsModalContent',
                }, pageSettings(model, () => {
                    document.getElementById('pageSettingsModal').style.display = 'none';
                }))),
        ])
        : noSubPageSelected(model);
}

function tableBody(
    model, visibleFields, data, cellsSpecials, page,
) {
    return h('tbody', { id: `table-body-${data.url}` },
        [postingDataConfig[page] ? postForm(model, data) : '']
            .concat(data.rows.map((item) => row(
                model, visibleFields, data, item, cellsSpecials,
            ))));
}
