// import viewButton from './viewButton.js';
import { h, iconHome, iconPerson } from '/js/src/index.js';

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
    ]);
}

const headerSpecific = (model) => {
    switch (model.router.params.section) {
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