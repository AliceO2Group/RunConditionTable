import { h, iconHome, iconPerson, iconDataTransferDownload, iconMagnifyingGlass, iconReload } from '/js/src/index.js';
import downloadCSV from './csvExport.js';

export default function header(model) {
    return h('.flex-row.p2', [
        h('.w-50', [
            h('button.btn', iconHome()),
            ' ',
            h('button.btn', {
                onclick: () => model.logout()
            }, iconPerson()),
            ' ',
            h('span.f4.gray', 'Run Condition Table'),
        ]),
        h('.w-50', headerSpecific(model)),
        h('.w-10', functionalities(model)),
    ]);
}

const headerSpecific = (model) => {
    switch (model.router.params.section) {
        case '__home': return title('Home Page');
        case 'main': return title('Periods');
        case 'runsPerPeriod': return title('Runs per Period');
        case 'mc': return title('Monte Carlo');
        case 'flags': return title('Flags');
        default: return null;
    }
  };

const title = (text) => {
    return h('b.f4', text);
}

const functionalities = (model) => {
        return h('.button-group.text-right',
            // rowsOnPage(model),
            h('button.btn', {
                onclick: () => {
                    model.fetchedData.reqForData(true);
                    model.notify();
                }
            }, iconReload()),
            h('button.btn', {
                onclick: () => {
                    downloadCSV(model);
                }
            }, iconDataTransferDownload()),
            h('button.btn', {
                className: model.searchFieldsVisible? 'active': '',
                onclick: () => {
                    model.changeSearchFieldsVisibility();
                    model.notify();
                }
            }, iconMagnifyingGlass())
        );
}

const dropdownId = 'dropdown-rows-on-page-id';

/*
const downloadCSV = () => {
    console.log("downloading ");
}
*/

const rowsOnPage = (model) => {
    return [
    h('button.btn', {
        onclick: () => {
            if (document.getElementById(dropdownId).classList.contains('dropdown-opened'))
                document.getElementById(dropdownId).classList.remove('dropdown-open');
            else document.getElementById(dropdownId).classList.toggle('dropdown-open');
    }}, 'rowsOnPage'),
    h('.dropdown', {
        id: dropdownId,
        name: 'section-object-dropdown'
    }, [
        h('.dropdown-menu', [
            h('button.btn', {
                onclick: (e) => {
                    model.fetchedData.rowsOnPage = 5;
                    model.router.params.rowsOnPage = 5;
                    console.log(model.router.params.rowsOnPage);
                    model.router.handleLinkEvent(e);
                    //model.notify();
                    //model.fetchedData.reqForData(true)
                    //model.notify();
                }
            }, '5'),
            h('button.btn', {
                onclick: () => {
                    model.fetchedData.rowsOnPage = 10;
                    model.fetchedData.reqForData(true)
                    model.notify();
                }
            }, '10'),
            h('button.btn', {
                onclick: () => {
                    model.fetchedData.rowsOnPage = 15;
                    model.fetchedData.reqForData(true)
                    model.notify();
                }
            }, '15'),
        ])
    ])
    ]
}
