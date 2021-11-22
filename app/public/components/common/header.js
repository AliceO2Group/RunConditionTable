import viewButton from './viewButton.js';
import { h } from '/js/src/index.js';

export default function header(model) {
    return h('.header', {id: 'header'}, [
        viewButton(model, 'settings', () => alert('TODO')),
        h('h4.title', 'TODO Some useful tools will be placed here (like exports etc.?)'),
        h('.header-right', [
            h('.search', h('input', {id: 'main-panel-search', placeholder: 'search', type: 'input'})),
            viewButton(model, 'logout', () => model.logout()),
        ]), ' ',
    ]);
}