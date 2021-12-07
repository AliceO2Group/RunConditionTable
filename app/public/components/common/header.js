import viewButton from './viewButton.js';
import { h, iconHome, iconPerson } from '/js/src/index.js';

export default function header(model) {
    return h('.flex-row.p2', [
        h('.flex-grow', [
            h('button.btn', iconHome()),
            ' ',
            viewButton(model, 'logout', () => model.logout()),
            // the one below won't work:
            // h('button.btn', iconPerson(), {onclick: () => model.logout()}),
            ' ',
            h('span.f4.gray', 'Run Condition Table'),
        ])
    ]);
}