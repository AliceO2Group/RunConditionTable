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
import { RCT } from '../../../../config.js';

const { dataReqParams, pagesNames } = RCT;

export default function indexChip(model, index, url) {
    const dataPointer = model.getCurrentDataPointer();
    
    function removeNode(id) {
        const node = document.getElementById(id);
        console.log(node);
        
        /*
        if (node) {
            while (node.firstChild) {
                node.removeChild(node.lastChild);
            }
            node.remove();
        }
        */
    }
    
    const chip = (pageName) => dataPointer.page !== 'periods' && model.fetchedData[pageName][index]
                    ? h('.chip.pointer.p-left-15', {
                        onclick: () => {
                            model.router.go(`/?page=${pageName}&index=${index}&${dataReqParams.rowsOnSite}=50&${dataReqParams.site}=1&sorting=-name`)
                        },
                        id: `chip-${pageName}-${index}`,
                        class: dataPointer.index === index && dataPointer.page === pageName ? 'primary' : ''
                    },
                        index,
                        h('button.btn.close-10', {
                            onclick: () => {
                                // e.preventDefault();
                                /* e.stopPropagation();*/
                                // model.removeSubPage(pageName, index);
                                console.log('delete clicked!');
                                model.removeSubPage(pageName, index);
                                model.notify();
                                removeNode(`chip-${pageName}-${index}`);
                                console.log('done!');
                            }
                        }, 'hello'))
                    : '';
    
    switch (model.getCurrentDataPointer().page) {
        case pagesNames.periods:
            return chip(pagesNames.periods);
        case pagesNames.dataPasses:
            return chip(pagesNames.dataPasses);
        case pagesNames.runsPerPeriod:
            return chip(pagesNames.runsPerPeriod);
    }
    /*
    alonePageButton(model, pagesNames.periods, 'Periods'),
    fetchedDataPages(model, pagesNames.dataPasses, 'Data Passes'),
    fetchedDataPages(model, pagesNames.anchoragePerDatapass, 'Anchorage per Data pass'),
    fetchedDataPages(model, pagesNames.mc, 'Monte Carlo'),
    fetchedDataPages(model, pagesNames.anchoredPerMC, 'Anchored per MC'),
    fetchedDataPages(model, pagesNames.runsPerPeriod, 'Runs per period'),
    fetchedDataPages(model, pagesNames.runsPerDataPass, 'Runs per Data pass'),
    fetchedDataPages(model, pagesNames.flags, 'QA Expert Flagging'),
    */
    
    return chip(pagesNames.periods);
}
