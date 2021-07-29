import button from './button.js';
import { h } from '/js/src/index.js';

export default function header(model) {
    return h('.header', {id: 'header'}, [
        button('settings', () => alert('TODO')),
        h('h4.title', 'Some useful tools will be placed here (like exports etc.?)'),
        h('.header-right', [
            h('.search', h('input', {id: 'main-panel-search', placeholder: 'search', type: 'input'})),
            button('logout', () => model.logout()),
        ]), ' ',
    ]);
}