import { h, iconHome, iconPerson, iconDataTransferDownload, iconMagnifyingGlass } from '/js/src/index.js';

export default function header(model) {
    return h('.flex-row.p2', [
        h('.w-50', [
            h('button.btn', iconHome()),
            ' ',
            h('button.btn', iconPerson()),
            // viewButton(model, 'logout', () => model.logout()),
            // the one below won't work:
            // h('button.btn', iconPerson(), {onclick: () => model.logout()}),
            ' ',
            h('span.f4.gray', 'Run Condition Table'),
        ]),
        h('.w-50', headerSpecific(model)),
        h('.w-10', functionalities(model)),
    ]);
}

const headerSpecific = (model) => {
    switch (model.router.params.section) {
        case 'home': return title('Home Page');
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
    if (model.router.params.section == 'home')
        return h('.button-group.text-right',
            h('button.btn', iconDataTransferDownload()),
            h('button.btn', iconMagnifyingGlass()),
        );
    return null;
}