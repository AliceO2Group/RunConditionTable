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

import { h, iconHome, iconPerson, iconDataTransferDownload, iconMagnifyingGlass, iconReload } from '/js/src/index.js';
import downloadCSV from '../../utils/csvExport.js';

function magOnClick() {
    console.log('mag was clicked!');
    setTimeout(() => {
        var found = document.getElementsByClassName('tableScrollable');
		if (found.length > 0) {
			console.log('found!');
			var index;
			var css;
			var index2;
				
			var tableScrollable = found[0];
            tableScrollable.addEventListener('mouseenter', function(ev) {
                console.log(`mouse entered ${ev.target.tagName}`);
            })
			var tooltipCells = document.getElementsByClassName('tooltipCell');
			
            for (var i = 0; i < tooltipCells.length; i++) {
                tooltipCells[i].addEventListener('mouseenter', function(ev) {
					console.log('mouse enter registered!');
					console.log(ev.target.tagName);
                        
                    if (ev.target.tagName === 'TD' || ev.target.tagName === 'INPUT') {
                        var rect = ev.target.getBoundingClientRect();

						console.log(rect);

                        /*
						css = document.getElementById('css');
						index = css.sheet.insertRule(`.tooltip:hover .span::before {
                            background-color: black !important;
                            position: absolute;
                            left: ${rect.x + 50}px !important;
                            top: ${rect.top}px !important;
                        }`, 0);
                        index2 = css.sheet.insertRule(`.tooltip:hover .span::after {
                            background-color: black !important;
                            position: absolute;
                            left: ${rect.right}px !important;
                            top: ${rect.top}px !important;
                        }`, 0);
                        console.log(css.sheet);
                        */
                    } else if (css && css.sheet) {
                        console.log('some error probably :(');
                        // css.sheet.removeRule(index)
                        // css.sheet.removeRule(index2)
                    }

							
							// index = css.sheet.insertRule(`.tooltip span::before{left:${left - 50}px;top:${top}px}`, 0);
    						// index2 = css.sheet.insertRule(`.tooltip span::after{left:${left - 50}px;top:${top + 20}px}`, 0);
					  
                }, true);
			}
	    } else console.log("Not found :(");
    }, 100);
}

export default function header(model) {
    return h('.flex-row.p2', [
        h('.w-50', [
            h('button.btn', iconHome()),
            ' ',
            h('button.btn', {
                onclick: () => model.logout(),
            }, iconPerson()),
            ' ',
            h('button.btn', {
                onclick: () => model.fetchBookkeeping(),
            }, 'fetch bookkeeping'),
            h('span.f4.gray', 'Run Condition Table'),
        ]),
        h('.w-50', headerSpecific(model)),
        h('.w-10', functionalities(model)),
    ]);
}

const headerSpecific = (model) => {
    switch (model.getCurrentDataPointer().page) {
        case 'main': return title('Periods');
        case 'runsPerPeriod': return title('Runs per Period');
        case 'mc': return title('Monte Carlo');
        case 'flags': return title('Flags');
        default: return null;
    }
};

const title = (text) => h('b.f4', text);

const functionalities = (model) => h('.button-group.text-right', h('button.btn', {
    onclick: () => {
        model.fetchedData.reqForData(true);
        model.notify();
    },
}, iconReload()), h('button.btn', {
    onclick: () => {
        downloadCSV(model);
    },
}, iconDataTransferDownload()), h('button.btn', {
    className: model.searchFieldsVisible ? 'active' : '',
    onclick: () => {
        model.changeSearchFieldsVisibility();
        model.notify();
        magOnClick();
    },
}, iconMagnifyingGlass()));
